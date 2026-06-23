-- CreateTable
CREATE TABLE "site_contact_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "sectionTitle" VARCHAR(100) NOT NULL DEFAULT 'Contact',
    "phoneOrdersLabel" VARCHAR(50) NOT NULL DEFAULT 'Comenzi',
    "phoneOrders" VARCHAR(30) NOT NULL,
    "phoneTechnicalLabel" VARCHAR(50) NOT NULL DEFAULT 'Tehnic',
    "phoneTechnical" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "hours" VARCHAR(100) NOT NULL,
    "headerTagline" VARCHAR(255) NOT NULL DEFAULT 'Consultanță tehnică gratuită · Livrare în toată țara',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_contact_settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "site_contact_settings" (
    "id",
    "sectionTitle",
    "phoneOrdersLabel",
    "phoneOrders",
    "phoneTechnicalLabel",
    "phoneTechnical",
    "email",
    "address",
    "hours",
    "headerTagline",
    "updatedAt"
) VALUES (
    'default',
    'Contact',
    'Comenzi',
    '0773 985 486',
    'Tehnic',
    '0759 046 201',
    'contact@chargepro.ro',
    'București, România',
    'Luni – Vineri: 08:30 – 17:00',
    'Consultanță tehnică gratuită · Livrare în toată țara',
    CURRENT_TIMESTAMP
);
