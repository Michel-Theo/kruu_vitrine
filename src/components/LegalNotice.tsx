import { forwardRef } from 'react'
import { LEGAL } from '../config'

// Mentions légales : <dialog> natif (Échap ferme, focus géré par le navigateur).
export const LegalNotice = forwardRef<HTMLDialogElement>(function LegalNotice(_, ref) {
  return (
    <dialog
      ref={ref}
      className="legal"
      aria-labelledby="legal-title"
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
    >
      <div className="legal__body">
        <h2 id="legal-title">legal notice</h2>
        <p>
          <span className="label">about</span>
          <br />
          this is an <strong>unofficial fan site</strong>, made for free by a fan. it is not affiliated with, endorsed by
          or connected to kruu, Hallwood Media or any streaming platform.
        </p>
        <p>
          <span className="label">publisher</span>
          <br />a private individual, non-commercial. as allowed by French law (LCEN, art. 6-III-2), the publisher's
          identity has been provided to the host.
          <br />
          contact: {LEGAL.contact}
        </p>
        <p>
          <span className="label">hosting</span>
          <br />
          {LEGAL.host}
        </p>
        <p>
          <span className="label">your data</span>
          <br />
          no cookies, no analytics, nothing is stored on your device. like any website, the host processes your IP
          address to deliver the pages. the spotify player is only loaded if you press play (spotify's own terms then
          apply).
        </p>
        <p>
          <span className="label">rights</span>
          <br />
          music, artwork and photos © kruu / Hallwood Media, used here for non-commercial fan purposes. if you hold the
          rights and want anything changed or removed, write to the contact above and it will be done quickly.
        </p>
        {LEGAL.credit && (
          <p>
            <span className="label">design & code</span>
            <br />
            <a href={LEGAL.credit.url} target="_blank" rel="noopener noreferrer">
              {LEGAL.credit.name}
            </a>
          </p>
        )}
        <form method="dialog">
          <button className="legal__close mono">close ✕</button>
        </form>
      </div>
    </dialog>
  )
})
