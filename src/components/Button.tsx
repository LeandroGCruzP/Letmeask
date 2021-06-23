import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  return(
    /**
     * Passar todas as propriedades do button de HTML a través de ...props
     */
    <button className="button" {...props} />
  )
}