import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="google-signin-client_id" content="308312836672-mpph1meqftrivs6qavnechv75fttp3g5.apps.googleusercontent.com"></meta>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="g-signin2" data-onsuccess="onSignIn"></div>
    </div>
  )
}