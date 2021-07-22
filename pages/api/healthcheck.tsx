function HealthCheck(_: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: string; }): void; new(): any; }; }; }) {
    res.status(200).json({ "status": "ok" })
}

export default HealthCheck;
