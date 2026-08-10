"use client";

import { useEffect, useState } from "react";
import CompanyForm from "@/components/admin/CompanyForm";
import { updateCompany } from "@/lib/api/admin";
import { getCompany } from "@/lib/api/content";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { CompanyItem, CompanyWrite } from "@/lib/api/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonForm } from "@/components/ui/SkeletonForm";

export default function AdminCompanyPage() {
  const { authedFetch } = useAuth();
  const [company, setCompany] = useState<CompanyItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // Public read (GET /company). A 404 means the seed hasn't run yet
    // (backend/app/db/seed.py::seed_company always runs on startup, so this
    // is a defensive fallback, not the expected path) — PUT /admin/company
    // upserts, so the form still renders empty and lets an admin create it.
    getCompany()
      .then((data) => {
        setCompany(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) {
          setCompany(null);
          setStatus("ready");
          return;
        }
        setStatus("error");
      });
  }, []);

  async function handleSubmit(payload: CompanyWrite) {
    const updated = await updateCompany(authedFetch, payload);
    setCompany(updated);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Company
      </h1>
      <p className="mt-2 text-muted">
        Perfil público de la empresa. Solo existe un registro.
      </p>

      {status === "loading" && <SkeletonForm fields={8} />}
      {status === "error" && (
        <ErrorState message="No fue posible cargar los datos de la empresa." />
      )}
      {status === "ready" && (
        <div className="mt-6 max-w-2xl">
          <CompanyForm
            initialValue={company}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
