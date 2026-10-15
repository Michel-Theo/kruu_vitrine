import { forwardRef } from 'react'
import { LEGAL, RELEASE } from '../config'

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
          the official site for {RELEASE.title}, the new album by kruu.
        </p>
        <p>
          <span className="label">publisher</span>
          <br />
          {LEGAL.publisher}
          <br />
          contact:{' '}
          <a href={LEGAL.contact.href} target="_blank" rel="noopener noreferrer">
            {LEGAL.contact.label}
          </a>
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
          music, artwork and photos © 2026 kruu / Hallwood Media. all rights reserved.
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
