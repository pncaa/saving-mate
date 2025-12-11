import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import React, { useState } from "react";
import "./InOutForm.css";
import { supabase } from "../../lib/supabaseClient";

const InOutForm: React.FC = () => {
  const [filter, setFilter] = useState<"income" | "outcome">("income");

  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.amount) {
      alert("Nominal wajib diisi!");
      return;
    }

    const jenisTransaksi =
      filter === "income" ? "pemasukan" : "pengeluaran";

    const { data, error } = await supabase
      .from("transaksi")
      .insert([
        {
          jenis: jenisTransaksi,
          nominal: Number(formData.amount),
          keterangan: formData.notes || "",
          // timestamp TIDAK DIISI → otomatis dari database
        },
      ]);

    if (error) {
      console.error("Insert error:", error);
      alert("Gagal menyimpan transaksi: " + error.message);
      return;
    }

    alert("Transaksi berhasil disimpan!");

    setFormData({
      amount: "",
      notes: "",
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="inoutform">
        {/* Header */}
        <div className="header-title mt-6 mb-4 flex items-center">
          <h1 className="ml-4 text-lg font-semibold">
            <IonText>Form Pemasukan & Pengeluaran</IonText>
          </h1>
        </div>

        {/* Toggle income/outcome */}
        <div className="flex justify-center items-center mt-6">
          <IonButton
            expand="block"
            fill={filter === "income" ? "solid" : "outline"}
            className="small-button w-32"
            onClick={() => setFilter("income")}
          >
            Pemasukan
          </IonButton>

          <IonButton
            expand="block"
            fill={filter === "outcome" ? "solid" : "outline"}
            className="small-button w-32 ml-4"
            onClick={() => setFilter("outcome")}
          >
            Pengeluaran
          </IonButton>
        </div>

        {/* Form */}
        <div className="px-4 mt-6">
          <IonCard className="form-card">
            <IonCardContent className="card">

              {/* Nominal */}
              <IonItem className="item-white">
                <IonLabel position="stacked" className="text-black">
                  Nominal
                </IonLabel>
                <IonInput
                  type="text"
                  inputmode="numeric"
                  placeholder="Masukkan nominal"
                  value={formData.amount}
                  onIonInput={(e) => {
                    const value = e.detail.value || "";
                    const numericValue = value.replace(/[^0-9]/g, "");
                    handleInputChange("amount", numericValue);
                  }}
                  className="text-black"
                />
              </IonItem>

              {/* Catatan */}
              <IonItem className="item-white">
                <IonLabel position="stacked" className="text-black">Catatan</IonLabel>
                <IonTextarea
                  placeholder="Tambahkan catatan (opsional)"
                  value={formData.notes}
                  onIonInput={(e) =>
                    handleInputChange("notes", e.detail.value || "")
                  }
                  rows={3}
                  className="text-black"
                />
              </IonItem>

              <IonButton
                expand="block"
                className="mt-6"
                onClick={handleSubmit}
              >
                Simpan {filter === "income" ? "Pemasukan" : "Pengeluaran"}
              </IonButton>

            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InOutForm;
