export default function Page({ params, searchParams }: { params: { id: string }, searchParams: { color: string } }) {

  console.log(params);
  console.log(searchParams);

  return <div>My Post: {params.id}</div>
}
