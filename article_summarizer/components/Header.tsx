'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleFinanceNewsSummaryClick = () => {
    setIsMenuOpen(false)
    router.push('/finance-news-summary')
  }

  const handleFinanceCrawlingClick = () => {
    setIsMenuOpen(false)
    router.push('/finance-crawling')
  }

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Mobile Web App
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/finance-news-summary" onClick={handleFinanceNewsSummaryClick} className="text-white">증권사 레포트 요약</Link></li>
            <li><Link href="/finance-crawling" onClick={handleFinanceCrawlingClick} className="text-white">Finance Crawling</Link></li>
          </ul>
        </nav>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden mt-2">
          <ul className="flex flex-col space-y-2">
            <li><Link href="/" className="block py-2" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link href="/about" className="block py-2" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link href="/contact" className="block py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            <li><Link href="/finance-news-summary" onClick={handleFinanceNewsSummaryClick} className="block py-2 text-left">증권사 레포트 요약</Link></li>
            <li><Link href="/finance-crawling" onClick={handleFinanceCrawlingClick} className="block py-2 text-left">Finance Crawling</Link></li>
          </ul>
        </nav>
      )}
    </header>
  )
}
