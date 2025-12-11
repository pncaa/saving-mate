import {
  IonContent,
  IonPage,
  IonCard,
  IonText,
  IonIcon,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
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
import { supabase } from "../../lib/supabaseClient";

interface Kategori {
  id: string;
  nama: string;
  total: number;
  target: number;
  icon: string;
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

const Save: React.FC = () => {
  const history = useHistory();
  const [menuItems, setMenuItems] = useState<Kategori[]>([]);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    const { data, error } = await supabase
      .from("kategori")
      .select(`
        id,
        nama,
        target,
        detail_kategori (
          nominal,
          progress_tabungan ( nominal )
        )
      `)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    const items = data.map((d: any) => {
      const total = d.detail_kategori?.reduce((sum: number, item: any) => {
        const progresTotal = (item.progress_tabungan || []).reduce(
          (acc: number, prog: any) => acc + Number(prog.nominal || 0),
          0
        );
        const nominalNow = Number(item.nominal) || progresTotal || 0;
        return sum + nominalNow;
      }, 0);

      return {
        id: d.id,
        nama: d.nama,
        total: total || 0,
        target: Number(d.target) || 0,
        icon: iconMap[d.nama] || car,
      };
    });

    setMenuItems(items);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ "--background": "#e7e7e9" } as React.CSSProperties}>
        <div className="bg-sky-500 px-6 pt-9 pb-14 rounded-b-3xl">
          <div className="space-y-2">
            <h1 className="text-white text-xl font-semibold">Ayo Menabung</h1>
            <p className="text-white text-sm">
              "Masa depan cerah bukan hasil keberuntungan, tapi dari kebiasaan yang disiplin
              seperti menabung."
            </p>
          </div>
        </div>

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
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      colorMap[item.nama]
                    } shadow-md`}
                  >
                    <IonIcon icon={item.icon} className="text-2xl" />
                  </div>
                  <IonText className="text-gray-700 text-xs font-medium text-center mt-2 leading-tight max-w-[70px]">
                    {item.nama}
                  </IonText>
                </div>
              ))}
            </div>
          </IonCard>
        </div>

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
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        colorMap[item.nama]
                      } shadow-sm`}
                    >
                      <IonIcon icon={item.icon} className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{item.nama}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Total Tabungan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">
                      {formatRupiah(item.total)}
                    </p>
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
