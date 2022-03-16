import type { NextPage } from 'next'

interface MyProp {
  data: Response;
}
const Home: NextPage<MyProp> = () => {
  return (
    <>Hello World!</>
  )
}

export default Home