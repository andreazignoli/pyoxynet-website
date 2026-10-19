import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Prose, Facts } from '@/components/developers/doc'
import { LegalPage, ProviderBlock } from '@/components/legal/legal-page'
import { PROVIDER, LOG_RETENTION_DAYS, USAGE_DETAIL_MONTHS, KEY_RECORD_MONTHS } from '@/content/legal'
import { RETENTION_HOURS } from '@/content/facts'

export const metadata: Metadata = {
  title: 'Privacy policy | Oxynet',
  description:
    'What Oxynet processes when you use the app, the API, the MCP server or a free API key, why, for how long, and who else receives it.',
  alternates: { canonical: '/privacy' },
}

/**
 * Written from the sourced fact sheet (orchestration repo,
 * docs/privacy/fact-sheet-2026-10-15.md) and the founder's decisions of
 * 2026-10-19. Every statement here must be true of the running system: when
 * the system changes, this page changes with it.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      lede={
        <p>
          What Oxynet processes when you use the web app, the API, the MCP server, a free API key or
          this website: what, why, for how long, and who else receives it.
        </p>
      }
    >
      <Section id="controller" title="Who is responsible">
        <Prose>
          <ProviderBlock />
          <p>
            Write to that address about anything in this policy, including to exercise your rights.
          </p>
        </Prose>
      </Section>

      <Section id="short" title="The short version">
        <Prose>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Oxynet analyses the exercise test files you send it. It does not need to know who was
              tested, and it does not keep names, dates of birth or file names.
            </li>
            <li>
              The file you upload is read and discarded. The parsed recording is kept{' '}
              {RETENTION_HOURS} hours so you can analyse it, then deleted.
            </li>
            <li>We never use your uploads to train our models, and we never sell data.</li>
            <li>No advertising, no analytics trackers, no marketing email.</li>
          </ul>
        </Prose>
      </Section>

      <Section id="uploads" title="1. Exercise test files you upload">
        <Prose>
          <p>
            When you upload a file through the API, an AI assistant or the Oxynet skill, Oxynet
            writes it to a temporary file, reads it, and deletes the temporary file as soon as it has
            been read. The original file is never stored, and its name is used only to read the file
            extension.
          </p>
          <p>
            Exports from metabolic carts often contain the tested person&apos;s name, date of birth,
            sex, height or weight. Oxynet may read those fields in memory while interpreting the
            export, but <strong>it does not store any of them</strong>, nor the date of the test.
          </p>
          <p>
            <strong>What is kept</strong> is the parsed recording: the time series of the measured
            channels (for example oxygen uptake, ventilation, end-tidal gases and heart rate), the
            detected file format, how the recording was sampled, the external load and the protocol
            inferred from it, quality flags, and any thresholds the instrument recorded. Each
            recording gets a random identifier and can be reached only with the API key that
            uploaded it.
          </p>
          <p>
            <strong>For how long:</strong> {RETENTION_HOURS} hours, or longer only if you ask for it
            when you upload, up to 7 days. An hourly sweep deletes expired recordings, and you can
            delete one at any time. A deleted recording is gone from our storage, including its
            version history, within about two days.
          </p>
          <p>
            <strong>Why:</strong> to compute the analyses you ask for, which is the service you
            requested. On a free key you must upload only de-identified data (see the{' '}
            <Link href="/terms">terms</Link>). Where a recording still relates to an identifiable
            person, you are responsible for having a lawful basis to share it with us, and we process
            it only to return your results. Clinical use of patient data needs a written data
            processing agreement with us.
          </p>
        </Prose>
      </Section>

      <Section id="playground" title="2. The browser app">
        <Prose>
          <p>
            The browser app at app.oxynet.net lets anyone analyse a file without an account. A file
            uploaded there is read and discarded in the same way, and nothing about it is stored: the
            results are sent back to your browser only.
          </p>
          <p>To prevent abuse, the browser app:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              uses <strong>Cloudflare Turnstile</strong>, a check that loads a script from Cloudflare in
              your browser and sends Cloudflare a token and your IP address to tell people from
              automated programs;
            </li>
            <li>
              keeps, in the server&apos;s memory only, a short-lived session token with a small
              allowance of analyses, and a count of how many sessions each IP address started in the
              last five minutes. Neither is written to storage, and an IP address is held for at most
              ten minutes.
            </li>
          </ul>
          <p>
            Your browser keeps the session token in its local storage. The browser app sets no
            cookies. <strong>Why:</strong> our legitimate interest in keeping a free service available
            and protected from abuse.
          </p>
        </Prose>
      </Section>

      <Section id="keys" title="3. API keys">
        <Prose>
          <p>
            <strong>Free keys.</strong> When you sign in with Google or GitHub to get a free key, we
            receive and keep the email address they confirm and an account identifier, together with
            the date you accepted the terms and which version, your key&apos;s limits and expiry date,
            and a one-way fingerprint of the key. The key itself is never stored, which is why it is
            shown to you only once. We use your email address only to keep to one free key per
            person, to stop abuse, and for service or security notices about your key. Never for
            marketing.
          </p>
          <p>
            While you sign in, the sign-up page sets two cookies that only that page can read and
            that the sign-in needs: one lasts at most 10 minutes, while you are at Google&apos;s or
            GitHub&apos;s page, the other at most 15 minutes, back on ours. Neither is used for
            anything else.
          </p>
          <p>
            <strong>Keys issued by Oxynet</strong> record the name of the person or organisation they
            were issued to, which analyses and models they may use, a monthly limit and an expiry
            date.
          </p>
          <p>
            <strong>Connecting an AI assistant.</strong> Some assistants, such as Claude, connect
            through a sign-in page where you paste your key once. The assistant then holds an
            encrypted token that lets it act with your key for up to 30 days, renewable for up to
            180. It does not reveal your key, and revoking or replacing the key stops it.
          </p>
          <p>
            <strong>Why:</strong> to provide the key you asked for, and our legitimate interest in
            preventing abuse. <strong>For how long:</strong> a free key&apos;s record is deleted{' '}
            {KEY_RECORD_MONTHS} months after the key expires or is revoked.
          </p>
        </Prose>
      </Section>

      <Section id="usage" title="4. Usage counts">
        <Prose>
          <p>
            For each key we count analyses per month, to apply its limit, and per hour which analysis
            was run, through which route (API, AI assistant, the Oxynet skill or the browser app),
            which assistant, which file format, and whether it succeeded or why it was refused. These
            counts are attached to the one-way fingerprint of the key, never to the key itself, and
            they never include file contents, file names, recording identifiers, IP addresses or free
            text.
          </p>
          <p>
            <strong>Why:</strong> to apply limits and to understand how the service is used.{' '}
            <strong>For how long:</strong> {USAGE_DETAIL_MONTHS} months per key, after which only
            totals across all keys are kept.
          </p>
        </Prose>
      </Section>

      <Section id="logs" title="5. Server logs">
        <Prose>
          <p>
            Our servers keep logs to diagnose faults and to keep the service secure. A log records the
            request, the recording identifier, the key&apos;s fingerprint, the detected file format,
            the size of the file and the outcome. It never contains file contents, file names, keys,
            the name a key was issued to, email addresses or analysis results. The web server also
            records each request line and a network address. Logs are deleted after{' '}
            {LOG_RETENTION_DAYS} days.
          </p>
        </Prose>
      </Section>

      <Section id="website" title="6. This website">
        <Prose>
          <p>
            www.oxynet.net sets no cookies, runs no analytics or advertising trackers and has no
            forms. It remembers your light or dark theme in your browser&apos;s local storage. If you
            write to us through an email link, we receive your message in our mailbox.
          </p>
        </Prose>
      </Section>

      <Section id="assistants" title="7. Using Oxynet through an AI assistant or a coding agent">
        <Prose>
          <p>
            If you use Oxynet through an AI assistant such as Claude, ChatGPT or Gemini, or through a
            coding agent running the Oxynet skill, that assistant&apos;s provider processes what you
            send it under its own terms and privacy policy, which we do not control. The skill sends
            only a file you name and asks you to anonymise it first.
          </p>
        </Prose>
      </Section>

      <Section id="recipients" title="8. Who else receives data">
        <Facts
          rows={[
            ['Amazon Web Services', 'Hosting, storage and logs for the app and the API, in Frankfurt (EU).'],
            ['Cloudflare', 'The Turnstile check in the browser app: your IP address and a challenge token.'],
            ['Google and GitHub', 'Sign-in for free keys, if you choose them.'],
            ['Vercel', 'Hosting of this website: the requests your browser makes to it.'],
            ['Yopass', 'One-time links used to hand over keys issued by Oxynet: an encrypted message only.'],
            ['GitHub', 'Distribution of the Oxynet skill, if you install it.'],
          ]}
        />
        <Prose className="mt-4">
          <p>
            The app loads no fonts, scripts or images from third parties other than Cloudflare&apos;s
            check. Some of these providers are based outside the European Economic Area. Where data
            is transferred there, the transfer relies on the provider&apos;s certification under the
            EU-U.S. Data Privacy Framework or on the European Commission&apos;s standard contractual
            clauses.
          </p>
        </Prose>
      </Section>

      <Section id="security" title="9. Security">
        <Prose>
          <p>
            Data is encrypted in transit and at rest. Recordings are partitioned by key, so one key
            cannot read another&apos;s. Keys issued by Oxynet are handed over through encrypted
            one-time links; free keys are stored only as a one-way fingerprint.
          </p>
        </Prose>
      </Section>

      <Section id="rights" title="10. Your rights">
        <Prose>
          <p>
            You may ask us for access to your personal data, to correct or delete it, to restrict or
            object to its processing, and for a copy in a portable format. Write to{' '}
            <a href={`mailto:${PROVIDER.email}`}>{PROVIDER.email}</a>; we answer within one month.
            Recordings are not linked to a person, so to act on one, give us its recording identifier.
          </p>
          <p>
            You may also complain to the Italian data protection authority, the{' '}
            <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
              Garante per la protezione dei dati personali
            </a>
            , or to the authority where you live.
          </p>
        </Prose>
      </Section>

      <Section id="changes" title="11. Changes">
        <Prose>
          <p>
            When what Oxynet does with data changes, we update this page and its date. The current{' '}
            <Link href="/terms">terms of use</Link> are on their own page.
          </p>
        </Prose>
      </Section>
    </LegalPage>
  )
}
