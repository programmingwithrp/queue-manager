import { AddUserInputForm } from '@/components/ui/add-user-form'
import React from 'react'

export default function CreateUserPage({ params }: { params: { orgname: string } }) {
  console.log('OrgName'+ params.orgname);
  return (
    <AddUserInputForm orgranizationName={params.orgname} />
  )
}
