import { forwardRef } from 'react'
import { LEGAL } from '../config'

// Mentions légales : <dialog> natif (Échap ferme, focus géré par le navigateur).
export const LegalNotice = forwardRef<HTMLDialogElement>(function LegalNotice(_, ref) {
  return (
    <dialog ref={ref} className="legal" aria-labelledby="legal-title" onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}>
      <div className="legal__body">
        <h2 id="legal-title">legal notice</h2>
        <p>
          <span className="label">publisher</span>
          <br />
          {LEGAL.publisher}
          <br />
          {LEGAL.contact}
        </p>
        <p>
          <span className="label">hosting</span>
          <br />
          {LEGAL.host}
        </p>
        <p>
          <span className="label">data</span>
          <br />
          this site collects no personal data and sets no cookies. the spotify player is only loaded if you press play.
        </p>
        <p>
          <span className="label">credits</span>
          <br />© 2026 kruu. all images and music belong to their owners.
        </p>
        <form method="dialog">
          <button className="legal__close mono">close ✕</button>
        </form>
      </div>
    </dialog>
  )
})
