import Link from "next/link";
import { withRouter } from "next/router";
import Head from "next/head";

const Header = ({ router: { pathname } }) => (
  <header>
    <div>
      <Head>
        <script
          src="https://www.reactriot.com/entries/154-randomstring/vote.js"
          type="text/javascript"
        ></script>
      </Head>
    </div>
    <Link href="/">
      <a className={pathname === "/" ? "is-active" : ""}>Home</a>
    </Link>
    <Link href="/about">
      <a className={pathname === "/about" ? "is-active" : ""}>About</a>
    </Link>
    <style jsx>{`
      header {
        margin-bottom: 25px;
      }
      a {
        font-size: 14px;
        margin-right: 15px;
        text-decoration: none;
      }
      .is-active {
        text-decoration: underline;
      }
    `}</style>
  </header>
);

export default withRouter(Header);
