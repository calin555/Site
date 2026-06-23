import bcrypt from "bcryptjs";
import { getSupabase } from "../src/lib/supabase/server";

const ROLES = [
  {
    name: "Customer",
    slug: "customer",
    description: "Registered buyer with access to orders and account",
    permissions: ["orders:read:own", "reviews:write", "addresses:write"],
    isSystem: true,
  },
  {
    name: "Admin",
    slug: "admin",
    description: "Store operator with full admin panel access",
    permissions: [
      "products:read",
      "products:write",
      "orders:read",
      "orders:write",
      "customers:read",
      "inventory:write",
      "reviews:moderate",
      "coupons:write",
      "content:write",
      "analytics:read",
    ],
    isSystem: true,
  },
  {
    name: "Super Admin",
    slug: "super-admin",
    description: "Platform owner with system-level access",
    permissions: ["*"],
    isSystem: true,
  },
] as const;

const CATEGORIES = [
  {
    name: "Stații AC",
    slug: "statii-ac",
    description:
      "Încărcare alternativă pentru uz rezidențial și comercial, 7.4–22 kW.",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=600&h=400&fit=crop",
    sortOrder: 1,
  },
  {
    name: "Stații DC",
    slug: "statii-dc",
    description:
      "Încărcare rapidă DC pentru flote, parcări publice și centre comerciale.",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
    sortOrder: 2,
  },
  {
    name: "Accesorii",
    slug: "accesorii",
    description:
      "Cabluri, conectori, protecții și accesorii pentru instalare completă.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    sortOrder: 3,
  },
  {
    name: "Smart & OCPP",
    slug: "smart-ocpp",
    description:
      "Stații inteligente cu management la distanță și protocol OCPP.",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop",
    sortOrder: 4,
  },
];

const BRANDS = [
  { name: "ChargePro", slug: "chargepro" },
  { name: "VoltEdge", slug: "voltedge" },
  { name: "EcoWatt", slug: "ecowatt" },
  { name: "PowerLink", slug: "powerlink" },
  { name: "SmartCharge", slug: "smartcharge" },
  { name: "GridFlow", slug: "gridflow" },
];

const USERS = [
  {
    name: "Ion Popescu",
    email: "demo@chargepro.ro",
    phone: "0721234567",
    password: "Demo1234",
    roleSlug: "customer",
  },
  {
    name: "Admin ChargePro",
    email: "admin@chargepro.ro",
    phone: "0730000001",
    password: "Admin1234",
    roleSlug: "admin",
  },
  {
    name: "Super Admin",
    email: "super@chargepro.ro",
    password: "Super1234",
    roleSlug: "super-admin",
  },
];

async function main() {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  console.log("Seeding database...");

  for (const role of ROLES) {
    const { error } = await supabase.from("roles").upsert(
      {
        name: role.name,
        slug: role.slug,
        description: role.description,
        permissions: role.permissions,
        isSystem: role.isSystem,
        updatedAt: now,
      },
      { onConflict: "slug" }
    );
    if (error) throw error;
  }
  console.log("✓ Roles");

  for (const cat of CATEGORIES) {
    const { error } = await supabase.from("categories").upsert(
      {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
        updatedAt: now,
      },
      { onConflict: "slug" }
    );
    if (error) throw error;
  }
  console.log("✓ Categories");

  for (const brand of BRANDS) {
    const { error } = await supabase.from("brands").upsert(
      {
        name: brand.name,
        slug: brand.slug,
        isActive: true,
        updatedAt: now,
      },
      { onConflict: "slug" }
    );
    if (error) throw error;
  }
  console.log("✓ Brands");

  for (const user of USERS) {
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("slug", user.roleSlug)
      .maybeSingle();

    if (roleError) throw roleError;
    if (!role) continue;

    const passwordHash = await bcrypt.hash(user.password, 10);
    const { error } = await supabase.from("users").upsert(
      {
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
        passwordHash,
        roleId: role.id,
        isActive: true,
        updatedAt: now,
      },
      { onConflict: "email" }
    );
    if (error) throw error;
  }
  console.log("✓ Users (demo@chargepro.ro, admin@chargepro.ro, super@chargepro.ro)");

  console.log("\nDone! Produsele se adaugă din /admin/produse — catalogul DB pornește gol.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
