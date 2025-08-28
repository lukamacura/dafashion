// app/api/order-confirmation/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = {
  name: string;
  size?: string;
  qty: number;
  price: number;
};

type Customer = {
  name: string;
  email: string;
  address: string;
  payment: string;
};

interface OrderPayload {
  orderId: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
}

function isOrderPayload(x: unknown): x is OrderPayload {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  const customer = o.customer as Record<string, unknown> | undefined;
  const items = o.items as unknown;
  return (
    typeof o.orderId === "string" &&
    typeof o.total === "number" &&
    customer !== undefined &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.address === "string" &&
    typeof customer.payment === "string" &&
    Array.isArray(items) &&
    items.every((it) => {
      const i = it as Record<string, unknown>;
      return (
        typeof i.name === "string" &&
        (typeof i.size === "string" || typeof i.size === "undefined") &&
        typeof i.qty === "number" &&
        typeof i.price === "number"
      );
    })
  );
}

const renderEmailHtml = (params: {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  address: string;
  payment: string;
}) => {
  const { orderId, customerName, items, total, address, payment } = params;

  const itemsHtml = items
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 0;">${it.qty}× ${it.name}${it.size ? ` (${it.size})` : ""}</td>
          <td style="text-align:right;">${it.price.toLocaleString("sr-RS")} RSD</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111;">
      <h2 style="margin:16px 0;">Hvala na porudžbini, ${customerName}!</h2>
      <p>Vaša porudžbina <strong>#${orderId}</strong> je potvrđena.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td style="padding-top:12px;border-top:1px solid #eee;"><strong>Ukupno</strong></td>
            <td style="padding-top:12px;border-top:1px solid #eee;text-align:right;">
              <strong>${total.toLocaleString("sr-RS")} RSD</strong>
            </td>
          </tr>
        </tfoot>
      </table>
      <p><strong>Adresa:</strong> ${address}</p>
      <p><strong>Način plaćanja:</strong> ${payment}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#666;">Kontakt: orders@dandafashion.rs</p>
    </div>`;
};

export async function POST(req: NextRequest) {
  try {
    const raw = (await req.json()) as unknown;

if (!isOrderPayload(raw)) {
  return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
}

const { orderId, customer, items, total } = raw as OrderPayload;


    const html = renderEmailHtml({
      orderId,
      customerName: customer.name,
      items,
      total,
      address: customer.address,
      payment: customer.payment,
    });

    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM ?? "D&A Fashion <onboarding@resend.dev>",
      to: ["luka.xzy@gmail.com"], // kasnije: [customer.email]
      subject: `Potvrda porudžbine #${orderId} – D&A Fashion`,
      html,
      // bcc: ["orders@dandafashion.rs"], // uključi ako želiš admin kopiju
    });

    if (error) {
      // nema 'any' u catch-u
      return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    // umesto (e: any)
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
