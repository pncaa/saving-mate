// lokasi file src/pages/home/halo.tsx
import {
  IonContent,
  IonPage,
  IonCard,
  IonText,
  IonIcon,
  IonItem,
  IonLabel,
  IonTabButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./Homepage.css";
import saveMoney from "./money.json";
import Lottie from "lottie-react";
import {
  car,
  cardOutline,
  heart,
  school,
  phonePortraitOutline,
  people,
  gift,
  airplaneOutline,
  trendingDown,
  trendingUp,
} from "ionicons/icons";
import DetailKategori from "../detailkategori/detailkategori";

const Homepage: React.FC = () => {
  const history = useHistory();
  const menuItems = [
    { id: 1, name: "Kendaraan", icon: car, color: "bg-blue-100 text-blue-600" },
    {
      id: 2,
      name: "Keluarga",
      icon: people,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 3,
      name: "Elektronik",
      icon: phonePortraitOutline,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 4,
      name: "Liburan Tahunan",
      icon: airplaneOutline,
      color: "bg-orange-100 text-orange-600",
    },
    { id: 5, name: "Kesehatan", icon: heart, color: "bg-red-100 text-red-600" },
    {
      id: 6,
      name: "Pendidikan",
      icon: school,
      color: "bg-teal-100 text-teal-600",
    },
    {
      id: 7,
      name: "Hadiah",
      icon: gift,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 8,
      name: "Cicilan/Hutang",
      icon: cardOutline,
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="bg">
        {/* ===== BAGIAN ATAS (BACKGROUND BIRU) ===== */}
        <div className="px-4 pt-6 pb-32 bg-[#2195ed]">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-white text-xl font-semibold">Hi Kamu</h1>
              <p className="text-white/80 text-sm">Ringkasan keuangan Anda</p>
              <h1 className="text-white text-xl font-semibold mt-1">
                Rp. 1000.000.000
              </h1>
            </div>

            <div className="flex justify-center">
              <div className="bg-white rounded-full p-1 shadow-md flex items-center justify-center overflow-hidden w-24 h-24">
                <Lottie
                  animationData={saveMoney}
                  loop={true}
                  style={{ width: 160, height: 160 }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <IonCard className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <p className="text-gray-500 text-sm">
                Income <IonIcon icon={trendingUp} />{" "}
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-semibold text-green-600">Rp</span>
                <span className="text-lg font-bold text-green-600">
                  8.000.000
                </span>
              </div>
            </IonCard>

            <IonCard className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <p className="text-gray-500 text-sm">
                Outcome <IonIcon icon={trendingDown} />
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-semibold text-red-600">Rp</span>
                <span className="text-lg font-bold text-red-600">
                  3.000.000
                </span>
              </div>
            </IonCard>
          </div>
        </div>

        {/* ===== MENU BUTTON GRID REVISI ===== */}
        <div className="px-4 -mt-16 relative z-10">
          <IonCard className="p-4 rounded-3xl shadow-md bg-white">
            <div className="grid grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => history.push(`/detailkategori/${item.id}`)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color} shadow-md`}
                  >
                    <IonIcon icon={item.icon} className="text-2xl" />
                  </div>
                  <IonText
                    id="textname"
                    className="text-gray-700 font-medium text-center mt-2 whitespace-nowrap"
                  >
                    {item.name}
                  </IonText>
                </div>
              ))}
            </div>
          </IonCard>
        </div>

        {/* ===== BAGIAN PUTIH DI BAWAH ===== */}
        <div className="bg-white rounded-t-3xl p-6 mt-6 min-h-[60vh] shadow-inner text-gray-800 ">
          <h2 className="text-lg font-semibold mb-4 border-b h-10">
            Transaksi Terakhir
          </h2>

          {/* LIST TRANSAKSI */}
          <div className="space-y-3">
            {[
              { name: "Makan Siang", amount: -25000, date: "2025-01-15" },
              { name: "Makan Malam", amount: -25000, date: "2025-01-14" },
              { name: "Nabung PC", amount: 25000, date: "2025-01-14" },
              { name: "Jajan", amount: -25000, date: "2025-01-13" },
              { name: "Jajan", amount: -25000, date: "2025-01-12" },
            ].map((item, index) => (
              <IonItem key={index} lines="full" className="item-line">
                <IonLabel>
                  <div className="font-medium">{item.name}</div>

                  {/* Tampilkan Tanggal */}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </IonLabel>

                {/* Nominal */}
                {item.amount < 0 ? (
                  <span className="text-red-500 font-semibold">
                    - Rp {Math.abs(item.amount).toLocaleString("id-ID")}
                  </span>
                ) : (
                  <span className="text-green-500 font-semibold">
                    Rp {item.amount.toLocaleString("id-ID")}
                  </span>
                )}
              </IonItem>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Homepage;
