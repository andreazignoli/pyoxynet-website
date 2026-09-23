import type { Metadata } from 'next'
import Link from 'next/link'
import { DocHeader, Section, Prose, Callout, Facts, NextSteps } from '@/components/developers/doc'
import { MAILTO, LINKS } from '@/content/developers/meta'

export const metadata: Metadata = {
  title: 'CPET data handling, retention and security',
  description:
    'How the Oxynet CPET API handles uploaded exercise test data: uploaded bytes are parsed and discarded, parsed records expire after 24 hours, records are partitioned per API key, and local deployment exists for data that must not leave an institution.',
  alternates: { canonical: '/developers/data-handling' },
}

export default function DataHandlingPage() {
  return (
    <>
      <DocHeader
        eyebrow="Reference"
        title="Data handling"
        lede={
          <p>
            What happens to a recording sent to the hosted API, stated as the system&apos;s technical
            behaviour. Whether a deployment meets a given jurisdiction&apos;s requirements is a
            compliance assessment made with the partner, not a claim this page can make.
          </p>
        }
      />

      <Section id="lifecycle" title="A recording’s life">
        <Facts
          rows={[
            ['Uploaded bytes', 'Parsed from a temporary file and discarded. Never written to storage.'],
            ['Parsed record', 'Kept so later calls can name it by cpet_id. Deleted 24 hours after upload by default.'],
            ['Longer retention', 'Only when the caller asks (retain_hours), up to 168 hours. retain_hours: 0 expires it immediately.'],
            ['Where it lives', 'Amazon Web Services, region eu-central-1 (Frankfurt, Germany): the service on AWS App Runner, parsed records and models in Amazon S3. AWS is the only infrastructure provider that holds uploaded data.'],
            ['Encryption', 'HTTPS in transit. AES-256 server-side encryption at rest. Public access to the storage is blocked.'],
            ['Deletion on demand', <><code key="d">DELETE /v1/cpet/{'{id}'}</code> or the MCP tool <code key="m">delete_cpet</code>, at any time.</>],
            ['After expiry', <>The record reads back as <code key="n">CPET_NOT_FOUND</code>. Expired records are swept hourly.</>],
            ['Isolation', 'Records are partitioned per API key. One key cannot read another’s uploads.'],
            ['What persists', 'A monthly count of analyses per API key, with the key’s name and a timestamp. It holds nothing from any recording. Logs record the record id, the detected format and the byte count, never file contents or filenames.'],
            ['Results', 'Returned to the caller and not stored server-side.'],
            ['Failed parses', 'An unreadable file returns a structural probe (byte and delimiter counts) that carries none of its content.'],
            ['Upload URLs', 'One-shot, valid 5 minutes, carrying their own credential, so a script that posts a file handles no API key.'],
          ]}
        />
      </Section>

      <Section id="training" title="Training data">
        <Prose>
          <p>
            Nothing a customer uploads enters the training corpus. There is no path from the
            service’s storage into it: the corpus is built only from files supplied for research
            and loaded by hand.
          </p>
          <p>
            Research cohorts shared under a data transfer agreement are pseudonymised before they
            enter the corpus, and what a contributed dataset may then be used for is chosen in that
            agreement, use by use: evaluation only, representation learning without labels,
            supervised training, generative models, or nothing at all.
          </p>
        </Prose>
      </Section>

      <Section id="identifiers" title="Identifiers">
        <Prose>
          <p>
            Oxynet needs no patient identifiers, and none should be sent. CPET exports routinely
            carry the patient&apos;s name in the filename and the file header: remove names and dates
            of birth before uploading. A neutral filename is enough for most formats, since Oxynet
            ignores the name and never stores the bytes. Agents connected over MCP are instructed to
            say this before every upload and never to go looking for files on their own.
          </p>
          <p>
            Sharing a research dataset rather than using the service is covered by a data transfer
            agreement: <a href={LINKS.dataAgreement} target="_blank" rel="noopener noreferrer">our template</a>, or yours.
          </p>
        </Prose>
      </Section>

      <Section id="local" title="When data must not leave the institution">
        <Prose>
          <p>
            The hosted API sends recordings over HTTPS to app.oxynet.net. For environments where that
            is not acceptable, the same engine can be deployed on the partner&apos;s infrastructure
            or embedded in a product. That is scoped with each partner, not a self-service option:
            see <Link href="/developers/partners#deployment">deployment options</Link> or{' '}
            <a href={MAILTO.local}>ask about it</a>.
          </p>
        </Prose>
      </Section>

      <Section id="status" title="Regulatory status">
        <Callout tone="warn">
          <p>
            Oxynet is research software. It carries no CE mark and no FDA clearance, is not registered
            as software as a medical device in any jurisdiction, and must not be the basis of a
            diagnosis or treatment decision.
          </p>
          <p>
            No certification or regulatory compliance is claimed on this page. Deployment-specific
            requirements (data protection, hosting location, clinical use) are evaluated with the
            partner concerned.
          </p>
        </Callout>
      </Section>

      <Callout tone="todo">
        <p>
          Access logging and standard processor terms (Annex B of the data transfer agreement).
          Hosting, encryption and deletion are stated above and in Annex C of the agreement.
        </p>
      </Callout>

      <NextSteps
        links={[
          { href: '/developers/partners', label: 'Partner onboarding', note: 'Where these questions get answered for your deployment.' },
          { href: '/developers/api/v1#limits', label: 'Limits and retention', note: 'The numbers, in the API reference.' },
        ]}
      />
    </>
  )
}
