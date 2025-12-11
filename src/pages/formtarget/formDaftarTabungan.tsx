import {
  IonBackButton,
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonText
} from '@ionic/react';

import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

interface RouteParams {
  categoryId: string;
}

const FormDaftarTabungan: React.FC = () => {
  const { categoryId } = useParams<RouteParams>();
  const history = useHistory();

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    const targetNum = Number(target);

    if (!name.trim()) {
      setError("Nama tabungan wajib diisi");
      return;
    }

    if (!target || isNaN(targetNum) || targetNum <= 0) {
      setError("Target harus angka lebih dari 0");
      return;
    }

    setError("");
    setLoading(true);

    // hanya target dan nama → nominal default 0
    const { error: insertError } = await supabase
      .from("detail_kategori")
      .insert({
        kategori_id: categoryId,
        nama: name.trim(),
        target: targetNum,
        nominal: 0 // default awal
      });

    setLoading(false);

    if (insertError) {
      setError("Gagal menyimpan data: " + insertError.message);
      return;
    }

    history.replace(`/detailkategori/${categoryId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/detailkategori/${categoryId}`} />
          </IonButtons>
          <IonTitle>Tambah Daftar Tabungan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="px-4 pt-4">
          <IonCard className="p-4 rounded-2xl bg-white">

            <IonItem className="rounded-xl">
              <IonLabel position="stacked">Nama Tabungan</IonLabel>
              <IonInput
                placeholder="cth: Laptop Baru"
                value={name}
                onIonChange={(e) => setName(e.detail.value || "")}
              />
            </IonItem>

            <IonItem className="rounded-xl mt-3">
              <IonLabel position="stacked">Target Tabungan (IDR)</IonLabel>
              <IonInput
                type="number"
                placeholder="cth: 15000000"
                value={target}
                onIonChange={(e) => setTarget(e.detail.value || "")}
              />
            </IonItem>

            {error && (
              <div className="mt-2 px-1">
                <IonText color="danger">{error}</IonText>
              </div>
            )}

            <div className="mt-4 px-1">
              <IonButton expand="block" onClick={onSave} disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </IonButton>
            </div>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FormDaftarTabungan;
