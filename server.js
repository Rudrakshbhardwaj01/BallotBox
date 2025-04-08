const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

let id = 0
let candidates = [
    {
        id: ++id,
        name: "John Doe",
        party: "Democratic Party",
        votes: 0
    },
    {
        id: ++id,
        name: "Jane Smith",
        party: "Republican Party",
        votes: 0
    },
    {
        id: ++id,
        name: "Alex Johnson",
        party: "Green Party",
        votes: 0
    }
]

app.get("/list-candidates", (req, res) => {
    try {
        return res.json(candidates)
    } catch (error) {
        console.error('Error in /list-candidates:', error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.post("/vote-for/:candidateId", (req, res) => {
    try {
        const candidateId = parseInt(req.params.candidateId)
        console.log(`Attempting to vote for candidate ID: ${candidateId}`)

        let candidate = candidates.find(c => c.id === candidateId)

        if (!candidate) {
            console.log(`Candidate not found with ID: ${candidateId}`)
            return res.status(404).json({
                "message": "Candidate not found!"
            })
        }

        candidate.votes += 1
        console.log(`Vote cast for ${candidate.name}. New vote count: ${candidate.votes}`)
        return res.json({
            "message": `Vote casted for ${candidate.name}`
        })
    } catch (error) {
        console.error('Error in /vote-for:', error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.post("/register-candidate", (req, res) => {
    try {
        const { name, party } = req.body
        console.log(`Attempting to register candidate: ${name} from ${party}`)

        if (!name || !party) {
            console.log('Missing required fields')
            return res.status(400).json({ message: "Both name and party are required!" })
        }

        id++
        const newCandidate = {
            id,
            name,
            party,
            votes: 0
        }
        candidates.push(newCandidate)
        console.log(`New candidate registered: ${JSON.stringify(newCandidate)}`)
        return res.json({
            "message": "Candidate added",
            "Candidate ID": id
        })
    } catch (error) {
        console.error('Error in /register-candidate:', error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ message: "Something went wrong!" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Access the API at http://localhost:${PORT}`)
})
