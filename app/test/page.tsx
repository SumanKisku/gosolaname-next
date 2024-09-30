'use client'
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
const supabase = createClient()

export default function TestPage() {
  async function fetchData() {
    const { data, error } = await supabase.from('test').select();
    if (!error)
      console.log(data);
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div>Test</div>
  )
}
