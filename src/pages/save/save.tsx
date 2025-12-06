import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonText,
  IonIcon,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router-dom";
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

const Save: React.FC = () => {
  const history = useHistory();
  const menuItems = [
    { id: 1, name: "Kendaraan", icon: car, color: "bg-blue-100 text-blue-600", total: 5000000 },
    {
      id: 2,
      name: "Keluarga",
      icon: people,
      color: "bg-green-100 text-green-600",
      total: 3500000
    },
    {
      id: 3,
      name: "Elektronik",
      icon: phonePortraitOutline,
      color: "bg-purple-100 text-purple-600",
      total: 2000000
    },
    {
      id: 4,
      name: "Liburan Tahunan",
      icon: airplaneOutline,
      color: "bg-orange-100 text-orange-600",
      total: 10000000
    },
    { id: 5, name: "Kesehatan", icon: heart, color: "bg-red-100 text-red-600", total: 1500000 },
    {
      id: 6,
      name: "Pendidikan",
      icon: school,
      color: "bg-teal-100 text-teal-600",
      total: 8000000
    },
    {
      id: 7,
      name: "Hadiah",
      icon: gift,
      color: "bg-yellow-100 text-yellow-600",
      total: 500000
    },
    {
      id: 8,
      name: "Cicilan/Hutang",
      icon: cardOutline,
      color: "bg-gray-100 text-gray-600",
      total: 4000000
    },
  ];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#e7e7e9' } as React.CSSProperties}>
        {/* Header Section */}
        <div className="bg-sky-500 px-6 pt-9 pb-14 rounded-b-3xl">
          <div className="space-y-2">
            <h1 className="text-white text-xl font-semibold">Ayo Menabung</h1>
            <p className="text-white text-sm">"Masa depan cerah bukan hasil keberuntungan, tapi dari kebiasaan yang disiplin seperti menabung."</p>
          </div>
        </div>
        {/* ===== MENU BUTTON GRID REVISI ===== */}
        <div className="px-4 -mt-6 relative z-10">
          <IonCard className="p-4 rounded-3xl shadow-md bg-white">
            <div className="grid grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => history.push(`/detailkategori/${item.id}`)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} shadow-md`}
                  >
                    <IonIcon icon={item.icon} className="text-2xl" />
                  </div>
                  <IonText className="text-gray-700 text-xs font-medium text-center mt-2 leading-tight max-w-[70px]">
                    {item.name}
                  </IonText>
                </div>
              ))}
            </div>
          </IonCard>
        </div>

        {/* List Kategori dengan Total Tabungan */}
        <div className="px-4 mt-6 pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Tabungan</h2>
          <div className="space-y-3">
            {menuItems.map((item) => (
              <IonCard
                key={item.id}
                className="p-4 rounded-xl shadow-sm bg-white cursor-pointer"
                onClick={() => history.push(`/detailkategori/${item.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} shadow-sm`}>
                      <IonIcon icon={item.icon} className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Total Tabungan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{formatRupiah(item.total)}</p>
                  </div>
                </div>
              </IonCard>
            ))}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Save;
