import { IonBackButton, IonButton, IonCard, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonButtons, IonText } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface RouteParams {
  categoryId: string;
}

type NewItem = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  date: string;
};

const STORAGE_ITEMS_KEY = 'savingMate.items';

const readItemsStore = (): Record<string, NewItem[]> => {
  try {
    const raw = localStorage.getItem(STORAGE_ITEMS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeItemsStore = (store: Record<string, NewItem[]>) => {
  localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(store));
};

const FormDaftarTabungan: React.FC = () => {
  const { categoryId } = useParams<RouteParams>();
  const history = useHistory();

  const [name, setName] = useState('');
  const [target, setTarget] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onSave = () => {
    const t = Number(target);
    if (!name.trim()) { setError('Nama tabungan wajib diisi'); return; }
    if (isNaN(t) || t <= 0) { setError('Target harus angka > 0'); return; }

    const store = readItemsStore();
    const arr = store[categoryId] || [];
    const newItem: NewItem = {
      id: Date.now(),
      name: name.trim(),
      targetAmount: t,
      currentAmount: 0,
      date: new Date().toISOString().slice(0, 10),
    };
    store[categoryId] = [...arr, newItem];
    writeItemsStore(store);

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
              <IonInput placeholder="cth: Laptop Baru" value={name} onIonChange={e => setName(String(e.detail.value || ''))} />
            </IonItem>
            <IonItem className="rounded-xl mt-3">
              <IonLabel position="stacked">Target (IDR)</IonLabel>
              <IonInput type="number" placeholder="cth: 15000000" value={target} onIonChange={e => setTarget(String(e.detail.value || ''))} />
            </IonItem>
            {error && (
              <div className="mt-2 px-1"><IonText color="danger">{error}</IonText></div>
            )}
            <div className="mt-4 px-1">
              <IonButton expand="block" onClick={onSave}>Simpan</IonButton>
            </div>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FormDaftarTabungan;
