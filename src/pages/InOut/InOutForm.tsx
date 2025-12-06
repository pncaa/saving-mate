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
import { IonReactRouter } from '@ionic/react-router';

const InOutForm: React.FC = () => {
  const [filter, setFilter] = useState<"income" | "outcome">("income");
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    notes: "",
  });

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    // Tambahkan logic untuk menyimpan data
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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

        {/* Form Section */}
        <div className="px-4 mt-6">
          <IonCard className="form-card">
            <IonCardContent className="card">
              <IonItem className="item-white">
                <IonLabel position="stacked" className="text-black">Nama</IonLabel>
                <IonInput
                  type="text"
                  placeholder="Masukkan nama"
                  value={formData.name}
                  onIonInput={(e) => handleInputChange("name", e.detail.value!)}
                  className="text-black"
                />
              </IonItem>

              <IonItem className="item-white">
                <IonLabel position="stacked" className="text-black">Nominal</IonLabel>
                <IonInput
                  type="text"
                  inputmode="numeric"
                  placeholder="Masukkan nominal"
                  value={formData.amount}
                  onIonInput={(e) => {
                    const value = e.detail.value!;
                    // Hanya izinkan angka (0-9)
                    const numericValue = value.replace(/[^0-9]/g, '');
                    handleInputChange("amount", numericValue);
                  }}
                  className="text-black"
                />
              </IonItem>

              <IonItem className="item-white">
                <IonLabel position="stacked" className="text-black">Tanggal</IonLabel>
                <IonInput
                  type="date"
                  value={formData.date}
                  onIonInput={(e) => handleInputChange("date", e.detail.value!)}
                  className="text-black"
                />
              </IonItem>

              <IonItem className="item-white">
                <IonLabel position="stacked" className="text-black">Catatan</IonLabel>
                <IonTextarea
                  placeholder="Tambahkan catatan (opsional)"
                  value={formData.notes}
                  onIonInput={(e) => handleInputChange("notes", e.detail.value!)}
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
