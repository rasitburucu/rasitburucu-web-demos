import type { Metadata } from "next";
import { tr } from "@/content/vaziyet/tr";
import { Teklif } from "@/components/vaziyet/pages/Teklif";

export const metadata: Metadata = { title: tr.meta.teklif };

// Before paint: with no plot in the address and none in this tab's session,
// the "sample plot" note is shown by CSS, so it never pushes the page down later.
const ADRES_YOK = `try{if(!location.search&&!sessionStorage.getItem('vaziyet-arsa-v1'))document.documentElement.classList.add('vz-adres-yok')}catch(e){}`;

export default function TeklifPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ADRES_YOK }} />
      <Teklif />
    </>
  );
}
