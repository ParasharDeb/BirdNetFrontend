import type { Metadata } from "next";
import { CodeBlock } from "@/components/site/CodeBlock";
import { PageHeader, PageShell, SectionTitle } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Set it up",
  description: "Build your own Blue Bird: parts list, ESP32 + INMP441 wiring, the BirdNET server, firmware and the YOLOv8 detector.",
};

const parts = [
  ["ESP32 dev board", "2.4 GHz Wi-Fi — it cannot join 5 GHz networks"],
  ["INMP441 I2S MEMS microphone", "digital output, so no external ADC"],
  ["LED + resistor (optional)", "lights while recording"],
  ["100 nF ceramic capacitor", "decoupling, close to the mic; 10 µF optional"],
  ["Breadboard + jumper wires", ""],
  ["Laptop with a webcam", "runs the detector and the BirdNET server"],
];

const wiring = [
  ["VDD", "3V3", "3.3 V only"],
  ["GND", "GND", ""],
  ["SCK", "GPIO 26", "I2S bit clock"],
  ["WS", "GPIO 25", "I2S word select"],
  ["SD", "GPIO 33", "I2S data"],
  ["L/R", "GND", "left channel (see troubleshooting)"],
  ["LED +", "GPIO 27", "through a resistor"],
];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="glass-panel relative rounded-[26px] p-5 sm:p-7">
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0074fe,#088fd1)] text-lg font-light text-white shadow-[0_6px_16px_rgb(0_110_230/0.3)]">
          {n}
        </span>
        <h3 className="text-[22px] font-light tracking-[-0.01em] text-[#24384a]">{title}</h3>
      </div>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#2f4554] [&_code]:rounded [&_code]:bg-white/55 [&_code]:px-1 [&_code]:text-[13px]">
        {children}
      </div>
    </li>
  );
}

export default function SetupPage() {
  return (
    <PageShell current="/setup">
      <PageHeader eyebrow="Set it up" title={<>Build your own Blue Bird</>} ghost="SETUP">
        About an afternoon with a breadboard. Get each stage working on its own first — mic, then server, then trigger,
        then camera — and only then connect them.
      </PageHeader>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle kicker="Parts">What you need</SectionTitle>
          <ul className="glass-panel divide-y divide-white/40 rounded-[24px] px-5">
            {parts.map(([name, note]) => (
              <li key={name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-3.5">
                <span className="text-[15px] text-[#24384a]">{name}</span>
                {note && <span className="text-sm text-[#4d6473]">{note}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionTitle kicker="Wiring">INMP441 → ESP32</SectionTitle>
          <div className="glass-panel overflow-hidden rounded-[24px]">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-white/30 text-xs tracking-wide text-[#4d6473] uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Mic pin</th>
                  <th className="px-5 py-3 font-medium">ESP32</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {wiring.map(([pin, esp, note]) => (
                  <tr key={pin}>
                    <td className="px-5 py-3 font-medium text-[#24384a]">{pin}</td>
                    <td className="px-5 py-3 text-[#0a5fc0]">{esp}</td>
                    <td className="hidden px-5 py-3 text-sm text-[#4d6473] sm:table-cell">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle kicker="Step by step">From zero to CAPTURE</SectionTitle>
        <ol className="space-y-5">
          <Step n={1} title="Start the BirdNET server">
            <p>
              In the <code>birnet</code> folder, create a Python 3.12 environment and install the requirements.
            </p>
            <CodeBlock
              label="PowerShell — birnet/"
              code={`python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt`}
            />
            <p>Check which BirdNET label each target resolved to (anything marked MISSING can never be detected):</p>
            <CodeBlock label="PowerShell — birnet/" code={`.\\.venv\\Scripts\\python.exe -m scripts.check_species`} />
            <p>
              Run it on all interfaces so the ESP32 can reach it. The first start downloads the BirdNET model. Interactive
              docs live at <code>http://127.0.0.1:8000/docs</code>.
            </p>
            <CodeBlock label="PowerShell — birnet/" code={`.\\run.ps1`} />
            <p>
              Optional: put your location in <code>birnet/.env</code> so BirdNET&apos;s range filter can cut false
              positives.
            </p>
            <CodeBlock
              label="birnet/.env"
              code={`BIRDNET_LATITUDE=26.14
BIRDNET_LONGITUDE=91.79`}
            />
          </Step>

          <Step n={2} title="Flash the ESP32">
            <p>
              Open <code>esp32/birdnet_trigger/birdnet_trigger.ino</code> in the Arduino IDE with the ESP32 board package
              (v3.x, which provides <code>ESP_I2S.h</code>). Edit the block at the top:
            </p>
            <CodeBlock
              label="birdnet_trigger.ino"
              code={`const char* WIFI_NAME     = "your-2.4GHz-network";
const char* WIFI_PASSWORD = "your-password";
const char* BIRDNET_HOST  = "192.168.x.x";   // the laptop running the server
const uint16_t BIRDNET_PORT = 8000;`}
            />
            <p>
              Upload, then open the Serial Monitor at <strong>115200 baud</strong>. It prints the ESP32&apos;s IP address
              once it joins Wi-Fi.
            </p>
          </Step>

          <Step n={3} title="Fire a test trigger">
            <p>
              Make a sound near the mic and call the trigger by hand. The LED lights for the 5-second recording; the request
              stays open until BirdNET answers, so allow up to a minute.
            </p>
            <CodeBlock label="PowerShell" code={`curl.exe -m 60 http://<esp32-ip>/trigger`} />
            <p>
              You get <code>CAPTURE</code> when a target bird is confirmed (score ≥ 0.70) and <code>IGNORE</code>{" "}
              otherwise. The Serial Monitor shows which species scored what.
            </p>
          </Step>

          <Step n={4} title="Run the bird detector">
            <p>
              In <code>yolo_bird</code>, install the CPU build of PyTorch first, then the rest. The first run downloads{" "}
              <code>yolov8n.pt</code> (~6 MB).
            </p>
            <CodeBlock
              label="PowerShell — yolo_bird/"
              code={`python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
python bird_detect.py`}
            />
            <p>
              Keys: <code>s</code> saves the frame to <code>captures/</code>, <code>c</code> cycles the confidence
              threshold, <code>q</code> quits. Try <code>--imgsz 320</code> on a slow laptop.
            </p>
            <p className="rounded-2xl border border-[#e3b26b]/60 bg-[#fff4df]/60 p-3 text-sm text-[#6b4300]">
              Today the detector doesn&apos;t call <code>/trigger</code> by itself yet — wiring that up (with a cooldown so
              one bird triggers one recording) is the next step.
            </p>
          </Step>

          <Step n={5} title="Run this website (optional)">
            <p>
              The site and its S3 image gallery are a Next.js app in <code>app/</code>. Copy <code>.env.example</code> to{" "}
              <code>.env.local</code> and fill in the bucket for the gallery.
            </p>
            <CodeBlock
              label="terminal — app/"
              code={`npm install
npm run dev`}
            />
          </Step>
        </ol>
      </section>

      <section className="mt-16">
        <SectionTitle kicker="Troubleshooting">If something&apos;s off</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "Recordings are silent",
              "Change I2S_STD_SLOT_LEFT to I2S_STD_SLOT_RIGHT in setup(), or tie the mic's L/R pin to 3.3 V instead of GND.",
            ],
            ["Too quiet or clipping", "Adjust GAIN_SHIFT: 16 is quietest; each step lower doubles the volume."],
            [
              "“Cannot reach the BirdNET server”",
              "Check BIRDNET_HOST is the laptop's LAN IP, the server runs with --host 0.0.0.0, and the firewall allows port 8000.",
            ],
            ["Wi-Fi never connects", "The ESP32 only supports 2.4 GHz. Check the network name and password."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-[22px] border border-white/45 bg-white/20 p-5">
              <h3 className="text-lg font-light text-[#24384a]">{q}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#2f4554]">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
