// 📄 Uslovi.js
import React from 'react';
import './LegalPage.css';

export default function Uslovi() {
  return (
    <div className="legal-page">
      <h1>Uslovi korišćenja</h1>
      <p>Korišćenjem sajta "Privatni časovi" pristajete na sledeće uslove korišćenja.</p>

      <h2>1. Opis usluge</h2>
      <p>Ova platforma omogućava učenicima da pronađu i zakažu časove sa profesorima. Platforma ne učestvuje u naplati i ne garantuje ishod nastave.</p>

      <h2>2. Prava i obaveze profesora</h2>
      <ul>
        <li>Profesor je odgovoran za tačnost informacija na svom profilu.</li>
        <li>Profesor se obavezuje da poštuje zakazane termine i pravila komunikacije.</li>
      </ul>

      <h2>3. Prava i obaveze učenika</h2>
      <ul>
        <li>Učenik je dužan da pruži tačne kontakt informacije prilikom zakazivanja.</li>
        <li>U slučaju otkazivanja, poželjno je obavestiti profesora na vreme.</li>
      </ul>

      <h2>4. Ograničenje odgovornosti</h2>
      <p>Platforma ne snosi odgovornost za kvalitet nastave, dogovorenu cenu ili eventualne nesporazume između korisnika.</p>

      <h2>5. Brisanje naloga</h2>
      <p>Profesor može zatražiti brisanje naloga u bilo kom trenutku putem <a href="/kontakt">kontakt stranice</a>.</p>

      <h2>6. Izmene uslova</h2>
      <p>Uslovi korišćenja mogu biti ažurirani bez prethodne najave. Korisnicima se preporučuje da povremeno proveravaju ovu stranicu.</p>
    </div>
  );
}