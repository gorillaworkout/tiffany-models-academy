export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Tiffanny Models Academy',
    alternateName: 'TMA',
    url: 'https://tiffannymodelsacademy.com',
    logo: 'https://tiffannymodelsacademy.com/images/tma-magazine.jpg',
    description: 'Akademi model profesional terbaik di Indonesia dengan cabang di Jakarta dan Bandung.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Nadira Tiffanny',
    },
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Jakarta',
        addressCountry: 'ID',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'Bandung',
        addressCountry: 'ID',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-851-3352-4900',
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs: [
      'https://www.instagram.com/tiffannymodelsacademy/',
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      offerCount: 3,
      offers: [
        {
          '@type': 'Offer',
          name: 'E-Book Access',
          description: 'Akses e-book kurikulum modeling lengkap',
        },
        {
          '@type': 'Offer',
          name: 'Group Class',
          description: 'Kelas grup 16 sesi pelatihan modeling profesional',
        },
        {
          '@type': 'Offer',
          name: 'Private Class',
          description: 'Kelas privat one-on-one dengan pelatih profesional',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function CourseJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Professional Modeling Course',
    description: 'Kursus modeling profesional 16 modul: catwalk, foto posing, personal branding, runway makeup',
    provider: {
      '@type': 'Organization',
      name: 'Tiffanny Models Academy',
      url: 'https://tiffannymodelsacademy.com',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: [
        { '@type': 'Place', name: 'TMA Jakarta' },
        { '@type': 'Place', name: 'TMA Bandung' },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Apa itu Tiffanny Models Academy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tiffanny Models Academy (TMA) adalah akademi model profesional di Indonesia dengan cabang di Jakarta dan Bandung. TMA menyediakan pelatihan catwalk, foto posing, personal branding, dan runway makeup.',
        },
      },
      {
        '@type': 'Question',
        name: 'Berapa biaya kursus modeling di TMA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TMA menyediakan 3 paket: E-Book Access untuk belajar mandiri, Group Class dengan 16 sesi pelatihan langsung, dan Private Class untuk pelatihan one-on-one. Hubungi kami untuk informasi harga terbaru.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah harus tinggi untuk menjadi model?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tidak! TMA menerima semua tinggi badan. Dunia modeling modern sangat beragam. Yang penting adalah confidence, posture, dan kemampuan berpose di depan kamera.',
        },
      },
      {
        '@type': 'Question',
        name: 'Di mana lokasi TMA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TMA memiliki studio pelatihan di Jakarta dan Bandung. Kunjungi halaman kontak kami untuk alamat lengkap.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah model berhijab bisa bergabung?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tentu! TMA sangat mendukung model berhijab. Founder kami, Nadira Tiffanny, percaya bahwa hijab tidak menutupi kecantikan, tapi mendefinisikan ulang arti kecantikan.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
