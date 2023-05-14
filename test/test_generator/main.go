package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
)

// reference of tests: https://github.com/matter-labs/eip1962/blob/master/src/test/test_vectors/eip2537

type G1Add struct {
	P1X string `json:"p1x"`
	P1Y string `json:"p1y"`
	P2X string `json:"p2x"`
	P2Y string `json:"p2y"`
	RsX string `json:"rsx"`
	RsY string `json:"rsy"`
}

type G1Mul struct {
	P1X    string `json:"p1x"`
	P1Y    string `json:"p1y"`
	Scalar string `json:"scalar"`
	RsX    string `json:"rsx"`
	RsY    string `json:"rsy"`
}

type G2Add struct {
	P1XA0 string `json:"p1x_a0"`
	P1XA1 string `json:"p1x_a1"`
	P1YA0 string `json:"p1y_a0"`
	P1YA1 string `json:"p1y_a1"`
	P2XA0 string `json:"p2x_a0"`
	P2XA1 string `json:"p2x_a1"`
	P2YA0 string `json:"p2y_a0"`
	P2YA1 string `json:"p2y_a1"`
	RsXA0 string `json:"rsx_a0"`
	RsXA1 string `json:"rsx_a1"`
	RsYA0 string `json:"rsy_a0"`
	RsYA1 string `json:"rsy_a1"`
}

type G2Mul struct {
	P1XA0  string `json:"p1x_a0"`
	P1XA1  string `json:"p1x_a1"`
	P1YA0  string `json:"p1y_a0"`
	P1YA1  string `json:"p1y_a1"`
	Scalar string `json:"scalar"`
	RsXA0  string `json:"rsx_a0"`
	RsXA1  string `json:"rsx_a1"`
	RsYA0  string `json:"rsy_a0"`
	RsYA1  string `json:"rsy_a1"`
}

type PairingInput struct {
	P1X   string `json:"p1x"`
	P1Y   string `json:"p1y"`
	Q1XA0 string `json:"q1x_a0"`
	Q1XA1 string `json:"q1x_a1"`
	Q1YA0 string `json:"q1y_a0"`
	Q1YA1 string `json:"q1y_a1"`
}

type Pairing struct {
	Points  []PairingInput `json:"points"`
	Resault string         `json:"resault"`
}

func readCsv(path string) [][]string {
	// Open the CSV file
	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// Create a new CSV reader
	reader := csv.NewReader(file)

	// Read all records from CSV
	records, err := reader.ReadAll()
	if err != nil {
		panic(err)
	}

	return records
}

func main() {
	saveG1Add("g1_add.csv")
	saveG1Mul("g1_mul.csv")
	saveG2Add("g2_add.csv")
	saveG2Mul("g2_mul.csv")
	savePairing("pairing.csv")
}

func saveG1Add(path string) {
	records := readCsv(path)

	theG1Adds := make([]G1Add, 0, len(records))

	// Print each record
	for _, record := range records {
		theG1Add := g1Add(record[0], record[1])
		theG1Adds = append(theG1Adds, theG1Add)

	}

	// Convert the slice to a JSON-encoded byte array
	b, err := json.MarshalIndent(theG1Adds, "", "  ")
	if err != nil {
		panic(err)
	}

	// Write the byte array to a file
	file, err := os.Create("../fixtures/g1_add.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = file.Write(b)
	if err != nil {
		panic(err)
	}
}
func g1Add(ps, rs string) G1Add {
	return G1Add{
		P1X: ps[:128],
		P1Y: ps[128:256],
		P2X: ps[256:384],
		P2Y: ps[384:512],
		RsX: rs[:128],
		RsY: rs[128:256],
	}
}

func saveG1Mul(path string) {
	records := readCsv(path)

	theG1Muls := make([]G1Mul, 0, len(records))

	// Print each record
	for _, record := range records {
		theG1Mul := g1Mul(record[0], record[1])
		theG1Muls = append(theG1Muls, theG1Mul)
	}

	// Convert the slice to a JSON-encoded byte array
	b, err := json.MarshalIndent(theG1Muls, "", "  ")
	if err != nil {
		panic(err)
	}

	// Write the byte array to a file
	file, err := os.Create("../fixtures/g1_mul.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = file.Write(b)
	if err != nil {
		panic(err)
	}
}

func g1Mul(ps, rs string) G1Mul {
	return G1Mul{
		P1X:    ps[:128],
		P1Y:    ps[128:256],
		Scalar: ps[256:],
		RsX:    rs[:128],
		RsY:    rs[128:256],
	}
}

func saveG2Add(path string) {
	records := readCsv(path)

	theG2Adds := make([]G2Add, 0, len(records))

	// Print each record
	for _, record := range records {
		theG2Add := g2Add(record[0], record[1])
		theG2Adds = append(theG2Adds, theG2Add)
	}

	// Convert the slice to a JSON-encoded byte array
	b, err := json.MarshalIndent(theG2Adds, "", "  ")
	if err != nil {
		panic(err)
	}

	// Write the byte array to a file
	file, err := os.Create("../fixtures/g2_add.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = file.Write(b)
	if err != nil {
		panic(err)
	}
}

func g2Add(ps, rs string) G2Add {
	return G2Add{
		P1XA0: ps[:128],
		P1XA1: ps[128:256],
		P1YA0: ps[256:384],
		P1YA1: ps[384:512],
		P2XA0: ps[512:640],
		P2XA1: ps[640:768],
		P2YA0: ps[768:896],
		P2YA1: ps[896:1024],
		RsXA0: rs[:128],
		RsXA1: rs[128:256],
		RsYA0: rs[256:384],
		RsYA1: rs[384:512],
	}
}

func saveG2Mul(path string) {
	records := readCsv(path)

	theG2Muls := make([]G2Mul, 0, len(records))

	// Print each record
	for _, record := range records {
		theG2Mul := g2Mul(record[0], record[1])
		theG2Muls = append(theG2Muls, theG2Mul)
	}

	// Convert the slice to a JSON-encoded byte array
	b, err := json.MarshalIndent(theG2Muls, "", "  ")
	if err != nil {
		panic(err)
	}

	// Write the byte array to a file
	file, err := os.Create("../fixtures/g2_mul.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = file.Write(b)
	if err != nil {
		panic(err)
	}
}

func g2Mul(ps, rs string) G2Mul {
	return G2Mul{
		P1XA0:  ps[:128],
		P1XA1:  ps[128:256],
		P1YA0:  ps[256:384],
		P1YA1:  ps[384:512],
		Scalar: ps[512:],
		RsXA0:  rs[:128],
		RsXA1:  rs[128:256],
		RsYA0:  rs[256:384],
		RsYA1:  rs[384:512],
	}
}

func savePairing(path string) {
	records := readCsv(path)

	thePairings := make([]Pairing, 0, len(records))

	// Print each record
	for _, record := range records {
		record0Slice := make([]string, 0, len(record[0])/(128*6))

		for i := 0; i < len(record[0])/(128*6); i++ {
			record0Slice = append(record0Slice, record[0][128*6*i:128*6*(i+1)])
		}

		thePairing := pairing(record0Slice, record[1])
		thePairings = append(thePairings, thePairing)
	}

	// Convert the slice to a JSON-encoded byte array
	b, err := json.MarshalIndent(thePairings, "", "  ")
	if err != nil {
		panic(err)
	}

	// Write the byte array to a file
	file, err := os.Create("../fixtures/pairing2.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	_, err = file.Write(b)
	if err != nil {
		panic(err)
	}
}

func pairing(ps []string, rs string) Pairing {
	points := make([]PairingInput, 0, len(ps))
	for _, p := range ps {
		pairing := PairingInput{
			P1X:   p[:128],
			P1Y:   p[128:256],
			Q1XA0: p[256:384],
			Q1XA1: p[384:512],
			Q1YA0: p[512:640],
			Q1YA1: p[640:],
		}

		points = append(points, pairing)
	}

	return Pairing{
		Points:  points,
		Resault: rs,
	}
}

func g1AddForSolidity() {
	ps := "0000000000000000000000000000000012196c5a43d69224d8713389285f26b98f86ee910ab3dd668e413738282003cc5b7357af9a7af54bb713d62255e80f560000000000000000000000000000000006ba8102bfbeea4416b710c73e8cce3032c31c6269c44906f8ac4f7874ce99fb17559992486528963884ce429a992fee000000000000000000000000000000000001101098f5c39893765766af4512a0c74e1bb89bc7e6fdf14e3e7337d257cc0f94658179d83320b99f31ff94cd2bac0000000000000000000000000000000003e1a9f9f44ca2cdab4f43a1a3ee3470fdf90b2fc228eb3b709fcd72f014838ac82a6d797aeefed9a0804b22ed1ce8f7"
	rs := "000000000000000000000000000000001466e1373ae4a7e7ba885c5f0c3ccfa48cdb50661646ac6b779952f466ac9fc92730dcaed9be831cd1f8c4fefffd5209000000000000000000000000000000000c1fb750d2285d4ca0378e1e8cdbf6044151867c34a711b73ae818aee6dbe9e886f53d7928cc6ed9c851e0422f609b11"

	fmt.Printf("\"p1X_a\": \"0x%s\", \n", ps[:64])
	fmt.Printf("\"p1X_b\": \"0x%s\", \n", ps[64:128])
	fmt.Printf("\"p1Y_a\": \"0x%s\", \n", ps[128:192])
	fmt.Printf("\"p1Y_b\": \"0x%s\", \n", ps[192:256])
	fmt.Printf("\"p2X_a\": \"0x%s\", \n", ps[256:320])
	fmt.Printf("\"p2X_b\": \"0x%s\", \n", ps[320:384])
	fmt.Printf("\"p2Y_a\": \"0x%s\", \n", ps[384:448])
	fmt.Printf("\"p2Y_b\": \"0x%s\", \n", ps[448:512])

	fmt.Printf("\"RSX_a\": \"0x%s\", \n", rs[:64])
	fmt.Printf("\"RSX_b\": \"0x%s\", \n", rs[64:128])
	fmt.Printf("\"RSY_a\": \"0x%s\", \n", rs[128:192])
	fmt.Printf("\"RSY_b\": \"0x%s\" \n", rs[192:256])
}
