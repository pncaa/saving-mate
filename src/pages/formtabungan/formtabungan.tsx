import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonText,
  IonCard,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

interface RouteParams {
  categoryId: string;
  itemId: string;
}

interface DetailData {
  id: string;
  nama: string;
  target: number;
  nominal: number;
}

const FormTabungan: React.FC = () => {
  const { categoryId, itemId } = useParams<RouteParams>();
  const history = useHistory();

  const [detail, setDetail] = useState<DetailData | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchDetail();
  }, [categoryId, itemId]);

  const fetchDetail = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("detail_kategori")
      .select("id, nama, target, nominal")
      .eq("id", itemId)
      .eq("kategori_id", categoryId)
      .single();

    if (fetchError) {
      console.error("Gagal memuat detail tabungan:", fetchError);
      setError("Tidak dapat memuat data tabungan.");
      setLoading(false);
      return;
    }

    setDetail({
      id: data.id,
      nama: data.nama,
      target: Number(data.target) || 0,
      nominal: Number(data.nominal) || 0,
    });
    setLoading(false);
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const calcProgress = (current: number, target: number) =>
    target > 0 ? Math.min((current / target) * 100, 100) : 0;

  const addSaving = async () => {
    if (!detail) return;

    const add = Number(amount);
    if (!add || isNaN(add) || add <= 0) {
      setError("Nominal harus diisi dengan angka lebih dari 0.");
      return;
    }

    const cappedTotal =
      detail.target > 0 ? Math.min(detail.nominal + add, detail.target) : detail.nominal + add;

    setSaving(true);
    setError("");

    const { error: progressError } = await supabase
      .from("progress_tabungan")
      .insert({
        detail_id: detail.id,
        nominal: add,
      });

    if (progressError) {
      console.error("Gagal menyimpan progres:", progressError);
      setError("Gagal menyimpan progres tabungan.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("detail_kategori")
      .update({ nominal: cappedTotal })
      .eq("id", detail.id);

    if (updateError) {
      console.error("Gagal memperbarui nominal detail:", updateError);
      setError("Gagal memperbarui tabungan.");
      setSaving(false);
      return;
    }

    setDetail({ ...detail, nominal: cappedTotal });
    setAmount("");
    setSaving(false);
    history.replace(`/detailkategori/${categoryId}`);
  };

  const progress = detail ? calcProgress(detail.nominal, detail.target) : 0;
  const isTargetReached = detail ? detail.target > 0 && detail.nominal >= detail.target : false;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/detailkategori/${categoryId}`} />
          </IonButtons>
          <IonTitle>Tambah Tabungan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading && (
          <div className="px-4 pt-4">
            <p className="text-sm text-gray-500">Memuat data tabungan...</p>
          </div>
        )}

        {!loading && detail && (
          <div className="px-4 pt-4">
            <IonCard className="p-4 rounded-2xl bg-white">
              <h2 className="text-base font-semibold text-gray-800 mb-2">{detail.nama}</h2>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Terkumpul</span>
                <span className="font-semibold text-blue-600">{formatRupiah(detail.nominal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Target</span>
                <span className="font-semibold text-gray-800">{formatRupiah(detail.target)}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden mt-3">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">{progress.toFixed(1)}%</p>
            </IonCard>
          </div>
        )}

        {!loading && !detail && (
          <div className="px-4 pt-4">
            <p className="text-sm text-red-500">Data tabungan tidak ditemukan.</p>
          </div>
        )}

        <div className="px-4">
          <IonItem className="rounded-xl bg-white">
            <IonLabel position="stacked">Nominal yang dimasukkan</IonLabel>
            <IonInput
              type="number"
              placeholder="Masukkan nominal (IDR)"
              value={amount}
              onIonChange={(e) => setAmount(String(e.detail.value || ""))}
              disabled={isTargetReached || !detail}
            />
          </IonItem>
          <div className="px-1 mt-3">
            <IonButton
              expand="block"
              onClick={addSaving}
              disabled={isTargetReached || saving || !detail}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </IonButton>
          </div>
          <div className="px-1 mt-2">
            {error && <IonText color="danger">{error}</IonText>}
            {!error && (
              <IonText color="medium">
                {!isTargetReached
                  ? "Input hanya jumlah uang yang ditambahkan."
                  : "Target telah tercapai. Tidak bisa menambah lagi."}
              </IonText>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FormTabungan;
