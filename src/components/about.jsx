import './pages.css'

function About() {
  return (
    <section className="page-card">
      <h2>About Us</h2>
      <p>
        Hostel Management System helps students handle room allocation, records,
        and payments in one place.
      </p>
      <div className="values">
        <article>
          <h3>Efficiency</h3>
          <p>Fast and simple workflows for daily hostel operations.</p>
        </article>
        <article>
          <h3>Security</h3>
          <p>Student and room data is handled with proper care.</p>
        </article>
        <article>
          <h3>Reliability</h3>
          <p>System is designed to stay available when needed most.</p>
        </article>
      </div>
    </section>
  )
}

export default About
