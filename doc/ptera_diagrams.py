from diagrams import Diagram, Cluster, Edge
from diagrams.aws.storage import S3
from diagrams.onprem.client import Client
from diagrams.programming.framework import NextJs
from diagrams.saas.identity import Auth0
from diagrams.custom import Custom


with Diagram("Ptera 構成図", show=False, direction="TB"):
    client = Client("ユーザー")

    with Cluster("Vercel"):
        with Cluster("Next.js"):
            frontend = NextJs("フロントエンド")
            backend = Custom("Hono\n(バックエンド)", "./resources/hono.png")
            frontend - backend

    # 外部サービス
    with Cluster("外部サービス"):
        auth0 = Auth0("Auth0\n(OpenID Connect)")
        s3 = S3("S3\n(静的アセット)")
        supabase_db = Custom("Supabase\n(Postgres)", "./resources/supabase.png")

    client >> Edge(color="black", style="bold") >> frontend
    frontend >> Edge(label="認証", color="blue") >> auth0
    frontend >> Edge(label="静的アセット取得", color="orange") >> s3
    backend >> Edge(label="データ操作", color="green") >> supabase_db
    backend >> Edge(label="認証確認", color="blue", style="dashed") >> auth0
