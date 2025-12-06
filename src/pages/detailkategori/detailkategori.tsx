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
  IonText,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { add } from "ionicons/icons";
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

const DetailKategori: React.FC = () => {
  const { categoryId } = useParams<RouteParams>();
  const history = useHistory();

  const categories: any = {
    "1": {
      name: "Kendaraan",
      icon: car,
      color: "bg-blue-100 text-blue-600",
      items: [
        { id: 1, name: "Motor Honda", targetAmount: 20000000, currentAmount: 5000000, date: "2025-01-10" },
        { id: 2, name: "Mobil", targetAmount: 150000000, currentAmount: 30000000, date: "2025-01-05" },
      ],
    },
    "2": {
      name: "Keluarga",
      icon: people,
      color: "bg-green-100 text-green-600",
      items: [
        { id: 1, name: "Acara Keluarga", targetAmount: 5000000, currentAmount: 3500000, date: "2025-01-12" },
      ],
    },
    "3": {
      name: "Elektronik",
      icon: phonePortraitOutline,
      color: "bg-purple-100 text-purple-600",
      items: [
        { id: 1, name: "Laptop Gaming", targetAmount: 15000000, currentAmount: 2000000, date: "2025-01-08" },
      ],
    },
    "4": {
      name: "Liburan Tahunan",
      icon: airplaneOutline,
      color: "bg-orange-100 text-orange-600",
      items: [
        { id: 1, name: "Liburan ke Bali", targetAmount: 10000000, currentAmount: 7000000, date: "2025-01-15" },
        { id: 2, name: "Liburan ke Jepang", targetAmount: 25000000, currentAmount: 3000000, date: "2025-01-03" },
      ],
    },
    "5": {
      name: "Kesehatan",
      icon: heart,
      color: "bg-red-100 text-red-600",
      items: [
        { id: 1, name: "Asuransi Kesehatan", targetAmount: 3000000, currentAmount: 1500000, date: "2025-01-11" },
      ],
    },
    "6": {
      name: "Pendidikan",
      icon: school,
      color: "bg-teal-100 text-teal-600",
      items: [
        { id: 1, name: "Kursus Online", targetAmount: 5000000, currentAmount: 3000000, date: "2025-01-09" },
        { id: 2, name: "Beasiswa Anak", targetAmount: 20000000, currentAmount: 5000000, date: "2025-01-07" },
      ],
    },
    "7": {
      name: "Hadiah",
      icon: gift,
      color: "bg-yellow-100 text-yellow-600",
      items: [
        { id: 1, name: "Hadiah Ulang Tahun", targetAmount: 1000000, currentAmount: 500000, date: "2025-01-13" },
      ],
    },
    "8": {
      name: "Cicilan/Hutang",
      icon: cardOutline,
      color: "bg-gray-100 text-gray-600",
      items: [
        { id: 1, name: "Cicilan Rumah", targetAmount: 50000000, currentAmount: 20000000, date: "2025-01-06" },
        { id: 2, name: "Hutang Bank", targetAmount: 10000000, currentAmount: 4000000, date: "2025-01-04" },
      ],
    },
  };

  const category = categories[categoryId] || categories["1"];

  // Read user-added items from localStorage and merge with base items
  const STORAGE_ITEMS_KEY = 'savingMate.items';
  let extraItems: any[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_ITEMS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    extraItems = Array.isArray(parsed[categoryId]) ? parsed[categoryId] : [];
  } catch {
    extraItems = [];
  }

  const mergedItems = [...category.items, ...extraItems];

  const STORAGE_KEY = 'savingMate.progress';
  let overrides: Record<string, number> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    overrides = parsed[categoryId] || {};
  } catch {
    overrides = {};
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const totalCurrent = mergedItems.reduce(
    (sum: number, item: any) => sum + (overrides[item.id] ?? item.currentAmount),
    0
  );
  const totalTarget = mergedItems.reduce(
    (sum: number, item: any) => sum + item.targetAmount,
    0
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/save" />
          </IonButtons>
          <IonTitle>{category.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ "--background": "#f5f5f5" } as React.CSSProperties}>
        {/* Header Card */}
        <div className="px-4 pt-4">
          <IonCard className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color} shadow-lg`}>
                <IonIcon icon={category.icon} className="text-3xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{category.name}</h2>
                <p className="text-white/80 text-sm">{category.items.length} Item Tabungan</p>
              </div>
            </div>
            
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex justify-between mb-2">
                <span className="text-white/90 text-sm">Total Terkumpul</span>
                <span className="text-white/90 text-sm">Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white text-lg font-bold">{formatRupiah(totalCurrent)}</span>
                <span className="text-white text-lg font-bold">{formatRupiah(totalTarget)}</span>
              </div>
              <div className="mt-3 bg-white/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress(totalCurrent, totalTarget)}%` }}
                />
              </div>
              <p className="text-white/90 text-xs text-center mt-2">
                {calculateProgress(totalCurrent, totalTarget).toFixed(1)}% tercapai
              </p>
            </div>
          </IonCard>
        </div>

        {/* List Item Tabungan */}
        <div className="px-4 mt-4 pb-20">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Daftar Tabungan</h3>
          <div className="space-y-3">
            {mergedItems.map((item: any) => (
              <IonCard
                key={item.id}
                className="p-4 rounded-xl shadow-sm bg-white cursor-pointer"
                onClick={() => history.push(`/formtabungan/${categoryId}/${item.id}`)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Ditambahkan: {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Terkumpul</span>
                      <span className="font-semibold text-blue-600">{formatRupiah(overrides[item.id] ?? item.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target</span>
                      <span className="font-semibold text-gray-800">{formatRupiah(item.targetAmount)}</span>
                    </div>

                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(overrides[item.id] ?? item.currentAmount, item.targetAmount)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      {calculateProgress(overrides[item.id] ?? item.currentAmount, item.targetAmount).toFixed(1)}%
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-600">
                      Kekurangan: <span className="font-semibold text-red-600">
                        {formatRupiah(item.targetAmount - (overrides[item.id] ?? item.currentAmount))}
                      </span>
                    </div>
                  </div>
                </div>
              </IonCard>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push(`/formdaftartabungan/${categoryId}`)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default DetailKategori;
