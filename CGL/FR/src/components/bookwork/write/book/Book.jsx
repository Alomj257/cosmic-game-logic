import React from 'react'
import CreateNewBook from './CreateNewBook'
import BriefIntroduction from './BriefIntroduction'
import AuthorNotes from './AuthorNotes'

const Book = () => {
  return (
    <>
    <CreateNewBook/>
    <BriefIntroduction/>
    <AuthorNotes/>
    </>
  )
}

export default Book