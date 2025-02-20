from diagrams import Diagram, Cluster
from diagrams.aws.compute import Lambda, ECR
from diagrams.aws.network import APIGateway, CloudFront
from diagrams.aws.database import RDS, ElastiCache
from diagrams.aws.storage import S3
from diagrams.aws.security import Cognito
from diagrams.onprem.iac import Terraform
from diagrams.aws.management import Cloudwatch

with Diagram("Noveller Architecture", show=False, filename="noveller_architecture"):
    user = Cognito("User")

    tf = Terraform("Terraform")

    with Cluster("AWS Cloud"):
        # 静的コンテンツ配信
        cdn = CloudFront("CloudFront\n+ SPA Hosting")
        static_site = S3("S3 (Remix SPA)")

        # API関連
        api_gw = APIGateway("API Gateway")

        # ECR にコンテナイメージを格納し、Lambda で利用
        deno_lambda = Lambda("Deno on Lambda (Container)")
        ecr = ECR("ECR")
        ecr >> deno_lambda

        with Cluster("VPC"):
            aurora = RDS("Aurora\nServerless v2")
            redis = ElastiCache("ElastiCache Redis")

        # 認証
        cognito = Cognito("Cognito")

        # ロギング
        monitoring = Cloudwatch("CloudWatch")

        # ユーザーの操作フロー
        user >> cdn >> static_site >> api_gw >> deno_lambda
        user >> cognito
        deno_lambda >> aurora
        deno_lambda >> redis

        tf >> [
            cdn,
            static_site,
            api_gw,
            deno_lambda,
            ecr,
            aurora,
            redis,
            cognito,
            monitoring,
        ]
