import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Prose } from '@/components/developers/doc'
import { LegalPage, ProviderBlock } from '@/components/legal/legal-page'
import { PROVIDER } from '@/content/legal'
import { RETENTION_HOURS } from '@/content/facts'

export const metadata: Metadata = {
  title: 'Terms of use | Oxynet',
  description:
    'The terms for using Oxynet: the web app and API at app.oxynet.net, the MCP server and free API keys.',
  alternates: { canonical: '/terms' },
}

/**
 * The terms decided by the founder on 2026-10-19 (orchestration repo,
 * docs/privacy/). The sign-up page in the app shows a four-line summary of
 * sections 3 to 6 and links here; keep the two in step and bump TERMS_VERSION
 * (src/content/legal.ts, and both files in oxynet-core) on any change of
 * substance.
 */
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      lede={
        <p>
          These terms apply when you use Oxynet: the web app and the API at app.oxynet.net, the MCP
          server for AI assistants, and the free API keys. They are written to be read. If anything
          is unclear, write to us.
        </p>
      }
    >
      <Section id="who" title="1. Who we are">
        <Prose>
          <ProviderBlock />
          <p>
            A separate written agreement with us, such as a data transfer agreement or a paid
            plan, takes precedence over these terms where the two differ.
          </p>
        </Prose>
      </Section>

      <Section id="research" title="2. Research software, not a medical device">
        <Prose>
          <p>
            Oxynet measures: it returns ventilatory thresholds, substrate use, oscillatory
            ventilation and signal-quality checks computed by validated models. It is research
            software. <strong>Its results are not a diagnosis and must not be used to make medical
            decisions about a person.</strong>
          </p>
          <p>
            No result carries a confidence score, because nothing is calibrated against clinical
            outcomes. Oscillatory ventilation analysis is beta: it was developed on one heart failure
            cohort and its transportability to other populations is untested.
          </p>
        </Prose>
      </Section>

      <Section id="who-may" title="3. Who may use free keys">
        <Prose>
          <p>
            Free API keys are for professionals, researchers and students aged 18 or over. They are
            not for personal medical decisions. Each person may hold one free key, tied to the email
            address you sign in with.
          </p>
          <p>
            <strong>Your key is personal.</strong> Do not share it, and do not put it in code or files
            that others can read. You are responsible for what is done with it. If it leaks, replace
            it on the sign-up page: the old key stops working at once.
          </p>
        </Prose>
      </Section>

      <Section id="data" title="4. Your data">
        <Prose>
          <p>
            <strong>On a free key, upload only de-identified data</strong>: nothing that directly
            identifies a person, such as a name, a date of birth or a record number. Remove these
            from an export before you upload it. Upload only data you have the right to share.
          </p>
          <p>
            Clinical use with patient data needs a written data processing agreement with us.{' '}
            <a href={`mailto:${PROVIDER.email}?subject=${encodeURIComponent('Oxynet data processing agreement')}`}>
              Ask us
            </a>
            .
          </p>
          <p>
            Uploaded files are discarded as soon as they are read. The parsed recording is deleted
            after {RETENTION_HOURS} hours, or later only if you ask for longer when you upload, and it
            is gone from our storage within about two days of its deletion. You can delete it
            sooner. <strong>We never use your uploads to train our models.</strong> The{' '}
            <Link href="/privacy">privacy policy</Link> says what else we process and why.
          </p>
        </Prose>
      </Section>

      <Section id="limits" title="5. Limits of the free tier">
        <Prose>
          <p>
            A free key has a monthly limit of analyses and an expiry date. Both are shown when you get
            the key and returned by <code>/v1/capabilities</code>. Uploads and analyses that Oxynet
            refuses do not count. When a key expires, sign in again to get a new one.
          </p>
        </Prose>
      </Section>

      <Section id="acceptable-use" title="6. Acceptable use">
        <Prose>
          <p>You may not:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>share your key, or use someone else&apos;s;</li>
            <li>create several free keys, by hand or automatically;</li>
            <li>
              try to copy, extract or reverse-engineer Oxynet&apos;s models, including by querying the
              service systematically to reconstruct them, or use Oxynet to build a competing model;
            </li>
            <li>resell, sublicense or otherwise give others access to Oxynet through your key;</li>
            <li>get around the limits, the security measures or the sign-up checks;</li>
            <li>upload malware, or data you do not have the right to share.</li>
          </ul>
          <p>We may revoke a key that breaks these rules, immediately and without notice.</p>
        </Prose>
      </Section>

      <Section id="ip" title="7. What belongs to whom">
        <Prose>
          <p>
            Your data stays yours. Oxynet&apos;s software, models and documentation stay ours. You may
            use the results you obtain in your own research and products. When you publish them,
            please cite Oxynet&apos;s publications.
          </p>
        </Prose>
      </Section>

      <Section id="availability" title="8. Availability and changes">
        <Prose>
          <p>
            Oxynet is provided as it is and as available. It may be interrupted for maintenance or by
            faults. We may change or end the free tier with 30 days&apos; notice on
            www.oxynet.net, or immediately to stop abuse or to protect security.
          </p>
        </Prose>
      </Section>

      <Section id="liability" title="9. Liability">
        <Prose>
          <p>
            To the extent the law allows, we give no warranty that Oxynet is fit for a particular
            purpose or free of errors, and we are not liable for indirect or consequential loss
            arising from its use.
          </p>
          <p>
            Nothing in these terms limits liability that the law does not allow to be limited,
            including for wilful misconduct or gross negligence, or the rights you have as a
            consumer.
          </p>
        </Prose>
      </Section>

      <Section id="law" title="10. Law and courts">
        <Prose>
          <p>
            These terms are governed by Italian law. Disputes go to the courts of {PROVIDER.courts},
            except where consumer protection law gives you the right to go to the courts where you
            live.
          </p>
        </Prose>
      </Section>

      <Section id="changes" title="11. Changes to these terms">
        <Prose>
          <p>
            When these terms change, we publish the new version here with its date. For a change of
            substance, you are asked to accept the new version the next time you sign in.
          </p>
        </Prose>
      </Section>
    </LegalPage>
  )
}
