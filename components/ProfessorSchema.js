import React from 'react';
import { Helmet } from 'react-helmet';

export default function ProfessorSchema({ professor }) {
  if (!professor) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `Privatni časovi ${professor.predmeti?.join(', ')}`,
    "description": `Časovi ${professor.predmeti?.join(', ')} za ${professor.nivoObrazovanja?.join(', ')} u ${professor.grad}. Profesor ${professor.ime}.`,
    "provider": {
      "@type": "Person",
      "name": professor.ime,
      "url": `https://www.pronadjiprofesora.com/professor/${professor.id}`
    },
    "educationalLevel": professor.nivoObrazovanja?.join(', '),
    "areaServed": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": professor.grad,
        "addressCountry": "RS"
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
