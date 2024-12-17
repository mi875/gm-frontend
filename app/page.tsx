import './TopPage.css';
import Link from "next/link"
import Image from "next/image";
import logo from './logo.png';
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="">
      <header>
        
      </header>
      <main className="">
        <div className=" h-[100svh]">
          <div className="top_container">
            <div className='box'>
              <h1 className='ims'>Inventory Manager</h1>
              <Image width={1846} height={1136} src={logo.src} alt="Logo" className='logo'/>
              <div className="link_button_wrap">
                <Link className='w-full' href="/login"><Button variant="outline" className='link_button_content'>Login</Button></Link>
                <Link className='w-full' href="/signup"><Button variant="outline" className='link_button_content'>Sign up</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
