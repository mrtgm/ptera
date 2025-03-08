from diagrams import Diagram, Cluster
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway, CloudFront
from diagrams.aws.database import RDS, ElastiCache
from diagrams.aws.storage import S3
from diagrams.aws.security import Cognito
from diagrams.onprem.iac import Terraform
from diagrams.aws.management import Cloudwatch

with Diagram("Ptera Architecture", show=False, filename="ptera_architecture"):
    user = Cognito("User")

    tf = Terraform("Terraform")

    with Cluster("AWS Cloud"):
        # 静的コンテンツ配信
        cdn = CloudFront("CloudFront")
        static_site = S3("S3 (Remix SPA)")

        # API関連
        api_gw = APIGateway("API Gateway")

        node_lambda = Lambda("Lambda(Node.js)")

        with Cluster("VPC"):
            aurora = RDS("Aurora\nServerless v2")
            redis = ElastiCache("ElastiCache Redis")

        # 認証
        cognito = Cognito("Cognito")

        # ロギング
        monitoring = Cloudwatch("CloudWatch")

        # ユーザーの操作フロー
        user >> cdn
        cdn >> static_site
        cdn >> api_gw >> node_lambda
        node_lambda >> aurora
        node_lambda >> redis

        tf >> [
            cdn,
            static_site,
            api_gw,
            node_lambda,
            aurora,
            redis,
            cognito,
            monitoring,
        ]
