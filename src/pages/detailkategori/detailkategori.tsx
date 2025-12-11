import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonCard,
  IonIcon,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { add } from "ionicons/icons";
import { supabase } from "../../lib/supabaseClient";
import React, { useEffect, useState } from "react";

import {
  car,
  cardOutline,
  heart,
  school,
  phonePortraitOutline,
  people,
  gift,
  airplaneOutline,
} from "ionicons/icons";

interface RouteParams {
  categoryId: string;
}

interface DetailItem {
  id: string;
  nama: string;
  nominal: number;
  target: number;
  created_at: string;
}

interface CategoryProgress {
  total: number;
  target: number;
  progress_persen: number;
}

const iconMap: Record<string, any> = {
  Kendaraan: car,
  Keluarga: people,
  Elektronik: phonePortraitOutline,
  "Liburan Tahunan": airplaneOutline,
  Kesehatan: heart,
  Pendidikan: school,
  Hadiah: gift,
  "Cicilan/Hutang": cardOutline,
};

const colorMap: Record<string, string> = {
  Kendaraan: "bg-blue-100 text-blue-600",
  Keluarga: "bg-green-100 text-green-600",
  Elektronik: "bg-purple-100 text-purple-600",
  "Liburan Tahunan": "bg-orange-100 text-orange-600",
  Kesehatan: "bg-red-100 text-red-600",
  Pendidikan: "bg-teal-100 text-teal-600",
  Hadiah: "bg-yellow-100 text-yellow-600",
  "Cicilan/Hutang": "bg-gray-100 text-gray-600",
};

const DetailKategori: React.FC = () => {
  const { categoryId } = useParams<RouteParams>();
  const history = useHistory();

  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress | null>(null);
  const [detailItems, setDetailItems] = useState<DetailItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  // Ambil kategori + daftar detail dengan akumulasi progres tabungan
  const fetchData = async () => {
    setLoading(true);
    const [
      { data: categoryData, error: categoryError },
      { data: detailsData, error: detailsError },
    ] = await Promise.all([
      supabase
        .from("kategori")
        .select("nama, target")
        .eq("id", categoryId)
        .single(),
      supabase
        .from("detail_kategori")
        .select("id, nama, target, nominal, created_at, progress_tabungan ( nominal )")
        .eq("kategori_id", categoryId)
        .order("created_at", { ascending: true }),
    ]);

    if (categoryError) console.error("Supabase kategori error:", categoryError);
    if (detailsError) console.error("Supabase detail error:", detailsError);

    setCategoryName(categoryData?.nama || "");

    const details = (detailsData || []).map((d: any) => {
      const progressTotal = (d.progress_tabungan || []).reduce(
        (sum: number, item: any) => sum + Number(item.nominal || 0),
        0
      );
      const currentNominal = Number(d.nominal) || progressTotal || 0;

      return {
        id: d.id as string,
        nama: d.nama as string,
        target: Number(d.target) || 0,
        nominal: currentNominal,
        created_at: d.created_at as string,
      };
    });

    const totalNominal = details.reduce((sum, item) => sum + item.nominal, 0);
    const targetValue = details.reduce((sum, item) => sum + (item.target || 0), 0);
    const progressValue = calculateProgress(totalNominal, targetValue);

    setDetailItems(details);
    setCategoryProgress({
      total: totalNominal,
      target: targetValue,
      progress_persen: progressValue,
    });
    setLoading(false);
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const calculateProgress = (current: number, target: number) =>
    target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/save" />
          </IonButtons>
          <IonTitle>{categoryName || "Detail Kategori"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ "--background": "#f5f5f5" } as any}>
        {/* HEADER KATEGORI */}
        <div className="px-4 pt-4">
          <IonCard className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  colorMap[categoryName] || "bg-white/20 text-white"
                } shadow-lg`}
              >
                <IonIcon icon={iconMap[categoryName] || car} className="text-3xl" />
              </div>

              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{categoryName}</h2>
                <p className="text-white/80 text-sm">{detailItems.length} Item Tabungan</p>
              </div>
            </div>

            {categoryProgress && (
              <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-white/90 text-sm">Total</span>
                  <span className="text-white/90 text-sm">Target</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white text-lg font-bold">
                    {formatRupiah(categoryProgress.total)}
                  </span>
                  <span className="text-white text-lg font-bold">
                    {formatRupiah(categoryProgress.target)}
                  </span>
                </div>

                <div className="mt-3 bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-full rounded-full"
                    style={{ width: `${categoryProgress.progress_persen}%` }}
                  />
                </div>

                <p className="text-white/90 text-xs text-center mt-2">
                  {categoryProgress.progress_persen.toFixed(1)}% tercapai
                </p>
              </div>
            )}
          </IonCard>
        </div>

        {/* LIST ITEM */}
        <div className="px-4 mt-4 pb-20">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Daftar Tabungan</h3>

          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-500">Memuat data...</p>}
            {!loading && detailItems.length === 0 && (
              <p className="text-sm text-gray-500">Belum ada tabungan di kategori ini.</p>
            )}
            {detailItems.map((item) => (
              <IonCard
                key={item.id}
                className="p-4 rounded-xl shadow-sm bg-white"
                onClick={() =>
                  history.push(`/formtabungan/${categoryId}/${item.id}`)
                }
              >
                <h4 className="text-base font-semibold text-gray-800">{item.nama}</h4>

                <p className="text-xs text-gray-500 mt-1">
                  Ditambahkan:{" "}
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <div className="flex justify-between text-sm mt-3">
                  <span className="text-gray-600">Terkumpul</span>
                  <span className="font-semibold text-blue-600">
                    {formatRupiah(item.nominal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target</span>
                  <span className="font-semibold text-gray-800">
                    {formatRupiah(item.target)}
                  </span>
                </div>

                {/* PROGRESS ITEM */}
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                    style={{
                      width: `${calculateProgress(
                        item.nominal,
                        item.target || 1
                      )}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-500 text-right mt-1">
                  {calculateProgress(item.nominal, item.target || 1).toFixed(1)}%
                </p>
              </IonCard>
            ))}
          </div>
        </div>

        {/* FAB BUTTON */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() =>
              history.push(`/formdaftartabungan/${categoryId}`)
            }
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default DetailKategori;
