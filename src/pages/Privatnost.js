// 📄 Privatnost.js
import React from 'react';
import './LegalPage.css';


export default function Privatnost() {
  return (
    <div className="legal-page">
      <h1>Politika privatnosti</h1>
      <p>Poštujemo vašu privatnost i brinemo o zaštiti vaših ličnih podataka. Ova politika objašnjava kako prikupljamo, koristimo i štitimo informacije koje korisnici unose tokom korišćenja platforme "Privatni časovi".</p>

      <h2>Koje informacije prikupljamo?</h2>
      <ul>
        <li>Ime i prezime (kada profesor pravi profil)</li>
        <li>Email adresa i broj telefona</li>
        <li>Podaci o rezervacijama (termini, predmet, ime učenika)</li>
      </ul>

      <h2>Kako koristimo vaše informacije?</h2>
      <p>Vaši podaci se koriste isključivo za:</p>
      <ul>
        <li>prikazivanje profila profesora učenicima,</li>
        <li>zakazivanje časova,</li>
        <li>slanje potvrda i podsetnika putem mejla,</li>
        <li>slanje formulara za ocenjivanje profesora.</li>
      </ul>

      <h2>Ko ima pristup vašim podacima?</h2>
      <p>Podaci se čuvaju u sigurnoj Firebase bazi podataka. Ne delimo ih sa trećim licima. Email i telefon profesora se prikazuju samo registrovanim učenicima prilikom rezervacije.</p>

      <h2>Kolačići (Cookies)</h2>
      <p>Sajt koristi kolačiće kako bi zapamtio vaše izbore i poboljšao korisničko iskustvo. Korišćenjem sajta pristajete na upotrebu kolačića.</p>

      <h2>Vaša prava</h2>
      <p>Imate pravo da zatražite uvid, izmenu ili brisanje vaših podataka. Kontaktirajte nas putem <a href="/kontakt">forme za kontakt</a>.</p>

      <h2>Izmene politike</h2>
      <p>Politika privatnosti može biti ažurirana. Svaka izmena biće objavljena na ovoj stranici.</p>
    </div>
  );
}