import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box } from "@material-ui/core"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date"
import { apiGetAllExpenses } from "../services/apiService"
import { IExpense, Expenses, Main, YearMonthForm } from "../components"
import { AxiosError } from "axios"
import { getTodayYearMonthISO } from "../util/util"

export default function MainPage() {
  const params = useParams<{ yearMonth: string }>()
  const yearMonth = params.yearMonth || getTodayYearMonthISO()
  const [expenses, setExpenses] = useState<IExpense[]>([])
  const [selectedYear, setSelectedYear] = useState<string>(`${yearMonth.substring(0, 4)}`)
  const [selectedMonth, setSelectedMonth] = useState<string>(`${yearMonth.substring(5)}`)
  const navigate = useNavigate()
  
  useEffect(() => {
    async function getAllExpenses() {
      try {
        const allExpenses = await apiGetAllExpenses(yearMonth)
        setExpenses(allExpenses)
      } catch (err: unknown) {
        const typedError = err as AxiosError
        throw Error(typedError.message)
      }
    }
    getAllExpenses()
  }, [yearMonth])

  function handleSelectedYearChange(newValue: MaterialUiPickersDate) {
    if (newValue) {
      const newYear = `${newValue.getFullYear().toString()}`
      setSelectedYear(newYear)
      navigate(`/expenses/${newYear}-${selectedMonth}`)
    }
  }

  function handleSelectedMonthChange(evt: React.ChangeEvent<{ value: unknown }>) {
    if (evt) {
      const newMonth: string = evt.target.value as string
      setSelectedMonth(newMonth)
      navigate(`/expenses/${selectedYear}-${newMonth}`)
    }
  }

  if (!expenses) {
    return <div>Loading data...</div>

  } else {
    return (
      <Main>
        <Box margin="50px">
          <YearMonthForm
            selectedYear={selectedYear}
            handleSelectedYearChange={handleSelectedYearChange}
            selectedMonth={selectedMonth}
            handleSelectedMonthChange={handleSelectedMonthChange}
          />

          <Expenses>
            {expenses}
          </Expenses>
        </Box>
      </Main>
    )
  }
}