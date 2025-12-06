import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonText, IonCard } from '@ionic/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface RouteParams {
  categoryId: string;
  itemId: string;
}

// Helper to persist amounts per category/item in localStorage
const STORAGE_KEY = 'savingMate.progress';

type ProgressStore = {
  [categoryId: string]: {
    [itemId: string]: number; // currentAmount override
  }
};

const readProgress = (): ProgressStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeProgress = (store: ProgressStore) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const FormTabungan: React.FC = () => {
  const { categoryId, itemId } = useParams<RouteParams>();
  const history = useHistory();

  // Minimal inline category data mirror to resolve target/current defaults
  const categories: Record<string, { items: { id: number; name: string; targetAmount: number; currentAmount: number; }[] }> = {
    '1': { items: [
      { id: 1, name: 'Motor Honda', targetAmount: 20000000, currentAmount: 5000000 },
      { id: 2, name: 'Mobil', targetAmount: 150000000, currentAmount: 30000000 },
    ] },
    '2': { items: [ { id: 1, name: 'Acara Keluarga', targetAmount: 5000000, currentAmount: 3500000 } ] },
    '3': { items: [ { id: 1, name: 'Laptop Gaming', targetAmount: 15000000, currentAmount: 2000000 } ] },
    '4': { items: [
      { id: 1, name: 'Liburan ke Bali', targetAmount: 10000000, currentAmount: 7000000 },
      { id: 2, name: 'Liburan ke Jepang', targetAmount: 25000000, currentAmount: 3000000 },
    ] },
    '5': { items: [ { id: 1, name: 'Asuransi Kesehatan', targetAmount: 3000000, currentAmount: 1500000 } ] },
    '6': { items: [
      { id: 1, name: 'Kursus Online', targetAmount: 5000000, currentAmount: 3000000 },
      { id: 2, name: 'Beasiswa Anak', targetAmount: 20000000, currentAmount: 5000000 },
    ] },
    '7': { items: [ { id: 1, name: 'Hadiah Ulang Tahun', targetAmount: 1000000, currentAmount: 500000 } ] },
    '8': { items: [
      { id: 1, name: 'Cicilan Rumah', targetAmount: 50000000, currentAmount: 20000000 },
      { id: 2, name: 'Hutang Bank', targetAmount: 10000000, currentAmount: 4000000 },
    ] },
  };

  const item = useMemo(() => {
    const cat = categories[categoryId];
    if (!cat) return undefined;
    return cat.items.find(i => String(i.id) === String(itemId));
  }, [categoryId, itemId]);

  const [amount, setAmount] = useState<string>('');
  const [current, setCurrent] = useState<number>(item?.currentAmount || 0);
  const target = item?.targetAmount ?? 0;

  // Load persisted override for current amount
  useEffect(() => {
    const store = readProgress();
    const saved = store[categoryId]?.[itemId];
    if (typeof saved === 'number') {
      setCurrent(saved);
    } else if (item) {
      setCurrent(item.currentAmount);
    }
  }, [categoryId, itemId]);

  const addSaving = () => {
    const add = Number(amount);
    if (!item) return;
    if (isNaN(add) || add <= 0) return;
    // Prevent adding if target already reached or would exceed target
    if (current >= target) return;
    const newCurrent = Math.min(current + add, target);

    const store = readProgress();
    const catStore = store[categoryId] || {};
    catStore[itemId] = newCurrent;
    store[categoryId] = catStore;
    writeProgress(store);

    // Navigate back to detail to see updated progress
    history.replace(`/detailkategori/${categoryId}`);
  };

  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  const progress = item ? Math.min((current / item.targetAmount) * 100, 100) : 0;
  const isTargetReached = current >= target;

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
        {item && (
          <div className="px-4 pt-4">
            <IonCard className="p-4 rounded-2xl bg-white">
              <h2 className="text-base font-semibold text-gray-800 mb-2">{item.name}</h2>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Terkumpul</span>
                <span className="font-semibold text-blue-600">{formatRupiah(current)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Target</span>
                <span className="font-semibold text-gray-800">{formatRupiah(item.targetAmount)}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden mt-3">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">{progress.toFixed(1)}%</p>
            </IonCard>
          </div>
        )}

        <div className="px-4">
          <IonItem className="rounded-xl bg-white">
            <IonLabel position="stacked">Nominal yang dimasukkan</IonLabel>
            <IonInput
              type="number"
              placeholder="Masukkan nominal (IDR)"
              value={amount}
              onIonChange={e => setAmount(String(e.detail.value || ''))}
              disabled={isTargetReached}
            />
          </IonItem>
          <div className="px-1 mt-3">
            <IonButton expand="block" onClick={addSaving} disabled={isTargetReached}>Simpan</IonButton>
          </div>
          <div className="px-1 mt-2">
            {!isTargetReached ? (
              <IonText color="medium">Input hanya jumlah uang yang ditambahkan.</IonText>
            ) : (
              <IonText color="danger">Target telah tercapai. Tidak bisa menambah lagi.</IonText>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FormTabungan;
