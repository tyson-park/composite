'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { sortData, SortDirection } from '../lib/sortUtils'

import type { EnhancedMobileTableProps } from '@/types/interfaces'

export default function EnhancedMobileTable<T>({ data, columns, caption }: EnhancedMobileTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T>(columns[0].key)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const sortedAndFilteredData = useMemo(() => {
    return sortData(
      data.filter(item => 
        Object.values(item as Record<string, unknown>).some(
          value => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
      sortColumn,
      sortDirection
    )
  }, [data, sortColumn, sortDirection, searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredData, currentPage])

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage)

  const handleSort = (column: keyof T) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ column }: { column: keyof T }) => {
    if (column !== sortColumn) return <ChevronsUpDown className="ml-2 h-4 w-4" />
    return sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <div className="p-4 max-w-full">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key as string}
                  className={`cursor-pointer ${column.width ? `w-[${column.width}]` : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    <SortIcon column={column.key} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index} className="sm:table-row flex flex-col mb-4 sm:mb-0">
                {columns.map((column) => (
                  <TableCell 
                    key={column.key as string} 
                    className={`font-medium sm:table-cell block before:content-['${column.header}:'] before:font-bold before:mr-2 sm:before:content-none`}
                  >
                    {String(item[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

