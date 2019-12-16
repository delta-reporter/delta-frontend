package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"delta-reporter/pkg/websocket"
)

type TestCase struct {
	Name        string
	Status      string
	Description string
	Browser     string
	SourceURL   string
	FuzzLevel   string
	// Screenshot
}

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	// fmt.Println("WebSocket Endpoint Hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Println(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

// // PostHandler converts post request body to string
func testCase(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// body, err := ioutil.ReadAll(r.Body)
		// if err != nil {
		// 	http.Error(w, "Error reading request body",
		// 		http.StatusInternalServerError)
		// }
		// results = append("Results", string(body))

		decoder := json.NewDecoder(r.Body)
		var t TestCase
		err := decoder.Decode(&t)
		if err != nil {
			panic(err)
		}
		// fmt.Println(t)
		fmt.Println(t.Status)
		fmt.Println(t.Description)

		// fmt.Println(w, string(body))

		// fmt.Println(w, "POST done")
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func setupRoutes() {
	fmt.Println("Setting routes")
	// mux := http.NewServeMux()
	pool := websocket.NewPool()
	go pool.Start()

	// mux.HandleFunc("/testcase", func(w http.ResponseWriter, r *http.Request) {
	// 	testCase(w, r)
	// })

	// mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
	// 	serveWs(pool, w, r)
	// })

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		// fmt.Println("Setting websocket")
		serveWs(pool, w, r)
	})

	http.HandleFunc("/testcase", func(w http.ResponseWriter, r *http.Request) {
		testCase(w, r)
	})

	// mux.HandleFunc("/", GetHandler)
	// mux.HandleFunc("/post", PostHandler)
}

func main() {
	fmt.Println("Delta Reporter App v0.01")
	setupRoutes()
	// fmt.Println("Routes set")
	log.Fatal(http.ListenAndServe(":8080", nil))
	fmt.Println("Something failed")
}
