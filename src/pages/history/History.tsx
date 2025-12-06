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
import React, { useState } from "react";

const History: React.FC = () => {
  const transactions = [
    { category: "Kendaraan", amount: 2000000, date: "2025-01-03" },
    { category: "Keluarga", amount: 1500000, date: "2025-02-05" },
    { category: "Elektronik", amount: 3000000, date: "2025-01-07" },
    { category: "Liburan Tahunan", amount: 4000000, date: "2024-12-10" },
    { category: "Kesehatan", amount: 1200000, date: "2025-03-11" },
    { category: "Hobi", amount: 800000, date: "2025-01-12" },
    { category: "Makanan", amount: 500000, date: "2024-12-14" },
  ];

  const [filter, setFilter] = useState<"all" | "income" | "outcome">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Filter Berdasarkan Income/Outcome
  const baseFiltered = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "income") return t.amount >= 1000000;
    if (filter === "outcome") return t.amount < 1000000;
    return true;
  });

  // Filter Berdasarkan Tahun & Bulan
  const finalFiltered = baseFiltered.filter((t) => {
    const date = new Date(t.date);
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
                className="small-button"
                onClick={() => setFilter("all")}
              >
                Keseluruhan
              </IonButton>
            </IonCol>

            <IonCol size="4">
              <IonButton
                expand="block"
                fill={filter === "income" ? "solid" : "outline"}
                className="small-button"
                onClick={() => setFilter("income")}
              >
                Income
              </IonButton>
            </IonCol>

            <IonCol size="4">
              <IonButton
                expand="block"
                fill={filter === "outcome" ? "solid" : "outline"}
                className="small-button"
                onClick={() => setFilter("outcome")}
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

          {finalFiltered.map((item, index) => (
            <IonItem key={index} lines="full" className="item-line">
              <IonLabel>
                <div className="font-medium">{item.category}</div>

                {/* Tanggal masuk */}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </IonLabel>

              {item.amount < 1000000 ? (
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
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default History;
