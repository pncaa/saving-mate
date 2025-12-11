import {
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import "./History.css";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const History: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pemasukan" | "pengeluaran">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // 🚀 Ambil data transaksi dari Supabase
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("transaksi")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return;
    }

    setTransactions(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter Berdasarkan Jenis (pemasukan/pengeluaran)
  const filteredByJenis = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.jenis === filter;
  });

  // Filter Berdasarkan Bulan & Tahun
  const finalFiltered = filteredByJenis.filter((t) => {
    const date = new Date(t.created_at);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    if (selectedYear !== "all" && selectedYear !== year) return false;
    if (selectedMonth !== "all" && selectedMonth !== month) return false;

    return true;
  });

  return (
    <IonPage>
      <IonContent fullscreen className="history-bg">
        {/* Header */}
        <div className="header-title mt-6 mb-4 flex items-center">
          <h1 className="ml-4 text-lg font-semibold border-b">
            Transaksi Keseluruhan
          </h1>
        </div>

        {/* Bulan & Tahun Selector */}
        <IonCard className="month-card">
          <IonCardContent className="month-card-content">
            <IonIcon icon={calendarOutline} />

            <IonSelect
              value={selectedMonth}
              placeholder="Bulan"
              onIonChange={(e) => setSelectedMonth(e.detail.value)}
            >
              <IonSelectOption value="all">Semua Bulan</IonSelectOption>
              <IonSelectOption value="01">Januari</IonSelectOption>
              <IonSelectOption value="02">Februari</IonSelectOption>
              <IonSelectOption value="03">Maret</IonSelectOption>
              <IonSelectOption value="04">April</IonSelectOption>
              <IonSelectOption value="05">Mei</IonSelectOption>
              <IonSelectOption value="06">Juni</IonSelectOption>
              <IonSelectOption value="07">Juli</IonSelectOption>
              <IonSelectOption value="08">Agustus</IonSelectOption>
              <IonSelectOption value="09">September</IonSelectOption>
              <IonSelectOption value="10">Oktober</IonSelectOption>
              <IonSelectOption value="11">November</IonSelectOption>
              <IonSelectOption value="12">Desember</IonSelectOption>
            </IonSelect>

            <IonSelect
              value={selectedYear}
              placeholder="Tahun"
              onIonChange={(e) => setSelectedYear(e.detail.value)}
            >
              <IonSelectOption value="all">Semua Tahun</IonSelectOption>
              <IonSelectOption value="2025">2025</IonSelectOption>
              <IonSelectOption value="2024">2024</IonSelectOption>
              <IonSelectOption value="2023">2023</IonSelectOption>
            </IonSelect>
          </IonCardContent>
        </IonCard>

        {/* Kategori Button */}
        <IonGrid className="category-buttons text-xs font-medium mt-4">
          <IonRow>
            <IonCol size="4">
              <IonButton
                expand="block"
                fill={filter === "all" ? "solid" : "outline"}
                onClick={() => setFilter("all")}
              >
                Keseluruhan
              </IonButton>
            </IonCol>

            <IonCol size="4">
              <IonButton
                expand="block"
                fill={filter === "pemasukan" ? "solid" : "outline"}
                onClick={() => setFilter("pemasukan")}
              >
                Income
              </IonButton>
            </IonCol>

            <IonCol size="4">
              <IonButton
                expand="block"
                fill={filter === "pengeluaran" ? "solid" : "outline"}
                onClick={() => setFilter("pengeluaran")}
              >
                Outcome
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Daftar Transaksi */}
        <IonGrid className="transaction-list">
          {finalFiltered.length === 0 && (
            <p className="text-center text-gray-500 mt-4">Tidak ada data.</p>
          )}

          {finalFiltered.map((item: any, index) => (
            <IonItem key={index} lines="full" className="item-line">
              <IonLabel>
                <div className="font-medium">{item.keterangan}</div>

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
                  - Rp {item.nominal.toLocaleString("id-ID")}
                </span>
              ) : (
                <span className="text-green-500 font-semibold">
                  Rp {item.nominal.toLocaleString("id-ID")}
                </span>
              )}
            </IonItem>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default History;
