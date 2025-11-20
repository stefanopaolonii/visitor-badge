export default function Home() {
  return null;
}

export async function getServerSideProps({ res }) {
  res.writeHead(302, { Location: 'https://stefanopaolonii.github.io/visitor-badge/' });
  res.end();
  return { props: {} };
}