import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map!: L.Map;
  userMarker!: L.Marker;

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    // Membuat peta dengan setView ke koordinat awal
    this.map = L.map('map').setView([-7.5586553745083425, 110.80527999201193], 17);

    // Basemaps
    const basemap1 = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    const basemap2 = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          'Tiles &copy; Esri | <a href="DIVSIGUGM" target="_blank">DIVSIG UGM</a>',
      }
    );
    const basemap3 = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          'Tiles &copy; Esri | <a href="Lathan WebGIS" target="_blank">DIVSIG UGM</a>',
      }
    );

    // Menetapkan Esri Imagery sebagai basemap default
    const baseMaps = {
      "OpenStreetMap": basemap1,
      "Esri World Street": basemap2,
      "Esri Imagery": basemap3,
    };

    // Menambahkan kontrol layer basemap dan memulai dengan basemap Esri Imagery
    L.control.layers(baseMaps).addTo(this.map);
    basemap3.addTo(this.map); // Tambahkan basemap Esri Imagery langsung ke peta

    // Custom Icon untuk marker
    const customIcon = L.icon({
      iconUrl: 'assets/icon/marker.png',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -45],
    });

    // Menambahkan marker ATM dari berbagai bank di sekitar Universitas Gadjah Mada (UGM)
    const atmLocations: [number, number, string][] = [
      [-7.76825075583956, 110.37555064211882, "BNI UGM"],
      [-7.76603963178332, 110.37696684991093, "BNI FMIPA UGM"],
      [-7.764934065387694, 110.37276114622443, "Mandiri Fakultas Teknik UGM"],
      [-7.771780025972069, 110.37967051657995, "Bank Muamalat UGM"],
      [-7.7758620363231294, 110.37645186579249, "CIMB Niaga Panti Rapih"],
      [-7.768151335427484, 110.38101696614814, "BPD UGM"],
      [-7.776492438898731, 110.37514579263936, "Center"],
      [-7.766353591775296, 110.37240070065585, "Center Sardjito"],
      [-7.7658282309794044, 110.37232520065582, "Bank BRI"],
      [-7.766787438942327, 110.38938082340577, "Indomaret Affandi"],
    ];

    // Menambahkan marker untuk setiap ATM
    atmLocations.forEach(([lat, lng, name]) => {
      L.marker([lat, lng], { icon: customIcon }).addTo(this.map).bindPopup(name);
    });

    // Menambahkan marker untuk setiap ATM dengan deskripsi dan gambar
atmLocations.forEach(([lat, lng, name]) => {
  let imgSrc = 'assets/icon/ATM.png'; // Gambar default jika tidak ada khusus untuk ATM ini

  // Menentukan gambar berdasarkan nama ATM
  if (name === "BNI UGM") {
    imgSrc = 'assets/icon/BNI-UGM.jpg';
  } else if (name === "BNI FMIPA UGM") {
    imgSrc = 'assets/icon/BNI-FMIPA.jpg';
  } else if (name === "Mandiri Fakultas Teknik UGM") {
    imgSrc = 'assets/icon/Mandiri-Teknik-png';
  } else if (name === "Bank Muamalat UGM") {
    imgSrc = 'assets/icon/Muamalat.jpg';
  } else if (name === "CIMB Niaga Panti Rapih") {
    imgSrc = 'assets/icon/CIMB-Panti.jpg';
  } else if (name === "BPD UGM") {
    imgSrc = 'assets/icon/BPD.jpg';
  } else if (name === "Center") {
    imgSrc = 'assets/icon/center.jpg';
  } else if (name === "Center Sardjito") {
    imgSrc = 'assets/icon/center-sar.jpg';
  } else if (name === "Bank BRI") {
    imgSrc = 'assets/icon/BRI.jpg';
  } else if (name === "Indomaret Affandi") {
    imgSrc = 'assets/icon/indo.jpg';
  }

  const popupContent = `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <h3 style="margin: 5px 0; font-size: 1.2em; color: #333;">${name}</h3>
      <p style="margin: 5px 0; font-size: 0.9em; color: #555;">ATM ${name} 24 Jam </p>
      <img src="${imgSrc}" alt="${name}" style="width:100%; height:auto; border-radius: 5px; margin-top: 10px;">
    </div>
  `;

  L.marker([lat, lng], { icon: customIcon })
    .addTo(this.map)
    .bindPopup(popupContent);  // Menggunakan HTML di sini
});


    // Menambahkan marker lokasi pengguna
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLatLng: [number, number] = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      // Menambahkan marker di lokasi terkini
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker); // Hapus marker lama jika ada
      }

      // Ganti icon dengan marker2.png
      const userIcon = L.icon({
        iconUrl: 'assets/icon/marker2.png',  // Mengganti dengan marker2.png
        iconSize: [40, 40],
        iconAnchor: [20, 50],
        popupAnchor: [0, -45],
      });

      this.userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(this.map);

      // Menambahkan styling untuk teks di popup
      const popupContent = `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h3 style="margin: 5px 0; font-size: 1.2em; color: #333;">Lokasi Anda saat ini</h3>
        </div>
      `;

      this.userMarker.bindPopup(popupContent).openPopup();

      // Pusatkan peta ke lokasi pengguna
      this.map.setView(userLatLng, 17);
    },
    (error) => {
      console.error("Error mendapatkan lokasi pengguna:", error);
    }
  );
} else {
  alert("Geolocation tidak didukung oleh browser Anda.");
}

  }
}
