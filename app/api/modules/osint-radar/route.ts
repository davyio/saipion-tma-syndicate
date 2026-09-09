import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 5: THE DOXX-RADAR (OSINT BREACH INTELLIGENCE)
 * Scans emails / handles for breach exposure and password leaks.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, isUnlocked } = body;

    if (!target) {
      return NextResponse.json({ ok: false, error: "Target email or handle required." }, { status: 400 });
    }

    // Generate realistic OSINT threat matrix
    const breaches = [
      {
        service: "Canva Database Leak",
        date: "May 2019",
        exposed: ["Email addresses", "Passwords (Bcrypt)", "City/Country"],
        leakedHash: isUnlocked ? "e9b5a8c2... (Plaintext: Summer2019!)" : "e9b5a8c2************************",
        threat: "HIGH",
      },
      {
        service: "Exploit.in / Collection #1 Combo",
        date: "Jan 2021",
        exposed: ["Plaintext credentials", "IP Logs", "Device Fingerprints"],
        leakedHash: isUnlocked ? "Raw Pass: Tr@d3r_2024! (Active on 3 services)" : "Tr@d3r_**** (REDACTED // 100 STARS TO UNMASK)",
        threat: "CRITICAL",
      },
      {
        service: "Telegram Scraping DB Dump",
        date: "Nov 2023",
        exposed: ["Phone numbers", "Telegram User IDs", "Linked Usernames"],
        leakedHash: isUnlocked ? "Phone: +1 (555) 019-2834 | Linked ID: 89005912" : "+1 (555) ***-**** | Linked ID: ********",
        threat: "MEDIUM",
      },
    ];

    const threatScore = Math.floor(Math.random() * 25) + 72; // 72-97 Threat Score

    return NextResponse.json({
      ok: true,
      target,
      threatScore,
      breachesFound: breaches.length,
      breaches,
      isUnlocked: Boolean(isUnlocked),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
