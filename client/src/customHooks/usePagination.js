import Pagination from "../components/Pagination"
import { useState } from "react"

const usePagination = ({itemPerPage}) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [allElementNumber, setAllElementNumber] = useState(0)

    const props = {
        allElementNumber, itemPerPage, currentPage, setCurrentPage, setAllElementNumber
    }

    return props
}

export default usePagination