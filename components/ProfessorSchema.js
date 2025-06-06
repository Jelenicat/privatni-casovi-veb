import React from 'react';
import { Helmet } from 'react-helmet';

export default function ProfessorSchema({ professor }) {
  if (!professor) return null;

  const {
    id,
    ime,
    predmeti = [],
    nivoObrazovanja = [],
    grad,
    cena,
    prosecnaOcena,
    brojKomentara,
    nacinCasova = {}
  } = professor;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `Privatni časovi ${predmeti.join(', ')}`,
    "description": `Časovi ${predmeti.join(', ')} za ${nivoObrazovanja.join(', ')} u ${grad}. Profesor ${ime}.`,
    "provider": {
      "@type": "Person",
      "name": ime,
      "url": `https://www.pronadjiprofesora.com/professor/${id}`
    },
    "educationalLevel": nivoObrazovanja.join(', '),
    "areaServed": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": grad,
        "addressCountry": "RS"
      }
    },
    ...(cena && {
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RSD",
        "price": cena,
        "availability": "https://schema.org/InStock"
      }
    }),
    ...(prosecnaOcena && brojKomentara && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": prosecnaOcena,
        "reviewCount": brojKomentara
      }
    }),
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": (
        nacinCasova.online && nacinCasova.uzivo
          ? ["online", "offline"]
          : (nacinCasova.online ? "online" : "offline")
      )
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
