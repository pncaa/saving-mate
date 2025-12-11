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
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface CategoryItem {
  id: string;
  nama: string;
  total: number;
  icon: any;
  color: string;
}

interface TransactionItem {
  id: string;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  created_at: string;
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

const Homepage: React.FC = () => {
  const history = useHistory();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [outcomeTotal, setOutcomeTotal] = useState<number>(0);
  const [tabunganTotal, setTabunganTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const now = useMemo(() => new Date(), []);
  const monthLabel = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchCategories(), fetchTransactions()]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("kategori")
      .select(`
        id,
        nama,
        detail_kategori (
          nominal,
          progress_tabungan ( nominal )
        )
      `);

    if (error) {
      console.error("Supabase kategori error:", error);
      return;
    }

    const cats = (data || []).map((d: any) => {
      const total = d.detail_kategori?.reduce((sum: number, item: any) => {
        const progresTotal = (item.progress_tabungan || []).reduce(
          (acc: number, prog: any) => acc + Number(prog.nominal || 0),
          0
        );
        const nominalNow = Number(item.nominal) || progresTotal || 0;
        return sum + nominalNow;
      }, 0) || 0;

      const name: string = d.nama;
      return {
        id: d.id as string,
        nama: name,
        total,
        icon: iconMap[name] || car,
        color: colorMap[name] || "bg-blue-100 text-blue-600",
      };
    });

    const sumTabungan = cats.reduce((sum, c) => sum + c.total, 0);
    setCategories(cats);
    setTabunganTotal(sumTabungan);
  };

  const fetchTransactions = async () => {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const { data, error } = await supabase
      .from("transaksi")
      .select("*")
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase transaksi error:", error);
      return;
    }

    const income = (data || []).reduce(
      (sum, t) => (t.jenis === "pemasukan" ? sum + Number(t.nominal || 0) : sum),
      0
    );
    const outcome = (data || []).reduce(
      (sum, t) => (t.jenis === "pengeluaran" ? sum + Number(t.nominal || 0) : sum),
      0
    );

    setIncomeTotal(income);
    setOutcomeTotal(outcome);
    setTransactions((data || []) as TransactionItem[]);
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const grandTotal = tabunganTotal + incomeTotal;

  return (
    <IonPage>
      <IonContent fullscreen className="bg">
        {/* ===== BAGIAN ATAS (BACKGROUND BIRU) ===== */}
        <div className="px-4 pt-6 pb-32 bg-[#2195ed]">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-white text-xl font-semibold">Hi Kamu</h1>
              <p className="text-white/80 text-sm">Ringkasan bulan {monthLabel}</p>
              <h1 className="text-white text-xl font-semibold mt-1">
                {formatRupiah(grandTotal)}
              </h1>
              <p className="text-white/80 text-xs">
                Tabungan Income: {formatRupiah(incomeTotal)}
              </p>
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
                Income {monthLabel} <IonIcon icon={trendingUp} />{" "}
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-semibold text-green-600">Rp</span>
                <span className="text-lg font-bold text-green-600">
                  {incomeTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </IonCard>

            <IonCard className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <p className="text-gray-500 text-sm">
                Outcome {monthLabel} <IonIcon icon={trendingDown} />
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-semibold text-red-600">Rp</span>
                <span className="text-lg font-bold text-red-600">
                  {outcomeTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </IonCard>
          </div>
        </div>

        {/* ===== MENU BUTTON GRID REVISI ===== */}
        <div className="px-4 -mt-16 relative z-10">
          <IonCard className="p-4 rounded-3xl shadow-md bg-white">
            <div className="grid grid-cols-4 gap-4">
              {categories.map((item) => (
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
                    {item.nama}
                  </IonText>
                </div>
              ))}
            </div>
          </IonCard>
        </div>

        {/* ===== BAGIAN PUTIH DI BAWAH ===== */}
        <div className="bg-white rounded-t-3xl p-6 mt-6 min-h-[60vh] shadow-inner text-gray-800 ">
          <h2 className="text-lg font-semibold mb-4 border-b h-10">
            Transaksi Terakhir ({monthLabel})
          </h2>

          {/* LIST TRANSAKSI */}
          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-500">Memuat data...</p>}
            {!loading && transactions.length === 0 && (
              <p className="text-sm text-gray-500">Belum ada transaksi bulan ini.</p>
            )}
            {transactions.map((item) => (
              <IonItem key={item.id} lines="full" className="item-line">
                <IonLabel>
                  <div className="font-medium">{item.keterangan || "Tanpa keterangan"}</div>

                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </IonLabel>

                {item.jenis === "pengeluaran" ? (
                  <span className="text-red-500 font-semibold">
                    - Rp {Number(item.nominal || 0).toLocaleString("id-ID")}
                  </span>
                ) : (
                  <span className="text-green-500 font-semibold">
                    Rp {Number(item.nominal || 0).toLocaleString("id-ID")}
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
